const db = require("../../database/models");
const User = db.users;
const VerificationToken = db.verification_tokens;
const bcrypt = require('bcrypt');
const { success, error, validation } = require("../middleware/responseApi");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const sendMailQueue = require('../middleware/queueBull')

require('dotenv').config();

function checkEmail(email) {
    return User.findOne({
        where: {
            email: email
        }
    })
}

function checkUserName(userName) {
    return User.findOne({
        where: {
            userName: userName
        }
    })
}

exports.signup = async (req, res) => {
    const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone
    }

    const emailExist = await checkEmail(req.body.email)
    if (emailExist) {
        res
            .status(400)
            .json(validation("Email already exists!", res.statusCode));
    }

    const usernameExist = await checkUserName(req.body.userName)
    if (usernameExist) {
        res
            .status(400)
            .json(validation("Username already exists!", res.statusCode));
    }

    try {
        const userCreate = await User.create(payload)
        res
            .status(200)
            .json(success(`User successfully created. A verification email has been sent to ${userCreate['dataValues'].email}`, userCreate,  res.statusCode));
        if (userCreate) {
            const generateToken = jwt.sign({
                username: userCreate['dataValues'].userName,
                id: userCreate['dataValues'].id
            }, process.env.JWT_SECRET, {
                expiresIn: '20m'
            });

            let token = {
                userId: userCreate['dataValues'].id,
                token: generateToken,
                type: 'signup'
            };
            const verified = await VerificationToken.create(token)

            let transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST.toString(),
                port: process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USERNAME.toString(),
                    pass: process.env.MAIL_PASSWORD.toString()
                }
            });
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(`Transporter Error : ${error}`);
                } else {
                    console.log('Server is ready to take our messages');
                }
            });

            const emailTemplate = `
            <html>
                <h1>Hello</h1><br>
                <p>Please verify your account by clicking the link</p><br><br>
                <a href='${process.env.BASE_URL}/confirmation/${verified['dataValues'].token}'>Verify Me</a>
            </html>
            `
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: userCreate['dataValues'].email,
                subject: 'Account Verification Token',
                html: emailTemplate
            };

            const options = {
                delay: 10000,
                attempts: 2,
            };

            sendMailQueue.add(mailOptions, options);
            sendMailQueue.process(async (req, result) => {
                await transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res
                            .status(500)
                            .json(error("Failed Send Verification Email", {error: err}, res.statusCode));
                    }
                })
            });


        }
    } catch (err) {
        return res
            .status(500)
            .json(error("General Error",  res.statusCode, err.message));
    }
}

exports.confirmation = async (req, res) => {
    const { token } = req.params
    let parseToken = 0
    const checkToken = await VerificationToken.findOne({
        where: {
            token: token
        }
    })
    if (!checkToken) {
        res
            .status(400)
            .json(error("Token is Not Valid"));
    }



    if (token == null) return res.sendStatus(401)
    await jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
        if(err){
            res.json(error("Link Expired", err.message));
        }
        parseToken += verifiedJwt['id']
    })

    const checkAlreadyActivated = await User.findOne({
        where: {
            id: parseToken,
            isVerified: true
        }
    })

    if (checkAlreadyActivated) {
        res
            .status(400)
            .json(error("Token Link is Already Activated the User."));
    }

    const payload = {
        isVerified: true,
        updatedAt: new Date()
    }

    try {
        const getVerified = await User.findOne({
            where: {
                id : parseToken,
                isVerified: true
            }
        })

        if (getVerified) {
            res
                .status(400)
                .json(error("Cannot verify User! User already verified"));
        } else {
            await User.update(payload, {
                where: {
                    id : parseToken,
                    isVerified: false
                }
            })
            res
                .status(200)
                .json(success("Success Verify User", payload, res.statusCode));
        }

    } catch (err) {
        res
            .status(500)
            .json(error("General Error", {error: err}, res.statusCode));
    }
}

exports.signin = async (req, res) => {
    const email = req.body.email
    const checkUserExist = await User.findOne({
        where: {
            email: email
        }
    })
    if (checkUserExist['dataValues'].isVerified === false) {
        res
            .status(400)
            .json(error("User not verified! Check your inbox to verify Account!", res.statusCode));
    }
    if(!checkUserExist) {
        res
            .status(400)
            .json(error("User not found!", res.statusCode));
    }

    const validPass = await bcrypt.compare(req.body.password, checkUserExist['dataValues'].password)
    if (!validPass) {
        res
            .status(400)
            .json(error("Wrong Password! Please Check Again", res.statusCode));
    }

    if (validPass === true) {
        const accessToken = jwt.sign({
            email: checkUserExist['dataValues'].email,
            id: checkUserExist['dataValues'].id,
            userName: checkUserExist['dataValues'].userName
        }, process.env.JWT_SECRET, {expiresIn: '1d'});
        if (accessToken) {
            res
                .status(200)
                .json(success("Login Success", accessToken, res.statusCode));
        }
    }

}

exports.forgotPassword = async (req, res) => {
    const checkEmailExist = await User.findOne({
        where: {
            email: req.body.email
        }
    })

    if (checkEmailExist['dataValues'].isVerified === false) {
        res
            .status(400)
            .json(error("User not verified! Check your inbox to verify Account!", res.statusCode));
    }

    if(!checkEmailExist) {
        res
            .status(400)
            .json(error(`Email ${req.body.email} not found! Please check again!`, res.statusCode));
    }

    const generateToken = jwt.sign({
        username: checkEmailExist['dataValues'].userName,
        id: checkEmailExist['dataValues'].id
    }, process.env.JWT_SECRET, {
        expiresIn: '20m'
    });

    let token = {
        userId: checkEmailExist['dataValues'].id,
        token: generateToken,
        type: 'forgot-password'
    };

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST.toString(),
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USERNAME.toString(),
            pass: process.env.MAIL_PASSWORD.toString()
        }
    });
    const verified = await VerificationToken.create(token)

    transporter.verify(function(error, success) {
        if (error) {
            console.log(`Transporter Error : ${error}`);
        } else {
            console.log('Server is ready to take our messages');
        }
    });
    const emailTemplate = `
            <html>
                <h1>Hello,</h1><br>
                <p>Use this link below to Reset Your Password</p><br><br>
                <a href='${process.env.BASE_URL}/reset-password/${verified['dataValues'].token}'>Reset Password</a>
            </html>
            `
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: checkEmailExist['dataValues'].email,
        subject: 'Reset Account Password',
        html: emailTemplate
    };
    await transporter.sendMail(mailOptions, function (err) {
        if (err) {
            return res
                .status(500)
                .json(error("Failed Send Reset Password Email", {error: err}, res.statusCode));
        }
        return res
            .status(200)
            .json(success(`A reset password email has been sent to ${checkEmailExist['dataValues'].email}`,  res.statusCode));
    })
}

exports.resetPassword = async (req, res) => {
    const { token } = req.params
    let parseToken = 0
    if (token == null) {
        res
            .status(401)
            .json(error("Unauthorized"));
    }
    await jwt.verify(token, process.env.JWT_SECRET, (err, verifiedJwt) => {
        if(err){
            res
                .status(401)
                .json(error("Link Expired"));
        }
        parseToken += verifiedJwt['id']
    })

    const payload = {
        password: bcrypt.hash(req.body.password, 10),
        updatedAt: new Date()
    }
    try {
        const getVerified = await User.findOne({
            where: {
                id : parseToken,
                isVerified: true
            }
        })
        if (!getVerified) {
            res
                .status(400)
                .json(error("Cannot Reset Password!"));
        }

        await User.update(payload, {
            where: {
                id : parseToken,
                isVerified: true
            }
        })
        return res
            .status(200)
            .json(success("Success Reset Password", res.statusCode));

    } catch (err) {
        res
            .status(500)
            .json(error("General Error", {error: err.message}, res.statusCode));
    }
}
