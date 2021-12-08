const db = require("../../database/models");
const User = db.users;
const bcrypt = require('bcrypt');
const { success, error, validation } = require("../middleware/responseApi");
const Op = db.Sequelize.Op;
const buildPaginator = require('pagination-apis');
const cloudinary = require('../middleware/cloudinary.js')

function hashPassword(pass) {
  return bcrypt.hash(pass, 10)
}

function getUserQueryFilter(req) {
  let whereConditions = {};
  if (req.query.userName) {
    whereConditions.userName = {
      [Op.like]: '%' + (req.query.userName) + '%'
    }
  }
  if (req.query.email) {
    whereConditions.email = {
      [Op.like]: '%' + (req.query.email) + '%'
    }
  }
  return whereConditions;
}

function getUserId(id) {
  return User.findOne({
    where: {
      id: id
    }
  })
}

exports.list = async (req, res) => {
  const { page, limit, skip, paginate } = buildPaginator({
    url: `${req.protocol}://${req.get('host')}/api/users`,
    limit: (!req.query.limit) ? parseInt(req.query.limit) : 10,
    page: parseInt(req.query.page)
  });

  const {count, rows} = await User.findAndCountAll({
    page,
    limit,
    offset: skip,
    where: getUserQueryFilter(req),
  });
  if (Object.keys({count, rows}).length === 0) {
    res
      .status(400)
      .json(error("No Users Available", res.statusCode));
  }
  res
    .status(200)
    .json(success("OK", paginate(rows, count), res.statusCode));
}

exports.find = async (req, res) => {
  try {
    const getUser = await getUserId(req.params.id)
    if (!getUser) {
      res
        .status(400)
        .json(validation("User not found!", res.statusCode));
    }

    res
      .status(200)
      .json(success("OK", getUser, res.statusCode));
  } catch (err) {
    res
      .status(500)
      .json(error("General Error", {error: err}, res.statusCode));
  }
}

exports.update = async (req, res) => {
  const id = req.params.id;
  const getUser = await getUserId(req.params.id)
  if (!getUser) {
    res
      .status(400)
      .json(validation("User not found!", res.statusCode));
  }

  const images= req.body.images;
  const uploadFunc = await cloudinary.uploader.upload(images)
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    phone: req.body.phone,
    photo: uploadFunc.url
  }

  try {
    await User.update(payload, {
      where: {
        id : id
      }
    }).then(() => {
      res
        .status(200)
        .json(success("Success edit data", payload, res.statusCode));
    }).catch((err) => {
      res
        .status(500)
        .json(error("General Error", {error: err}, res.statusCode));
    });
  } catch (err) {
    res
      .status(500)
      .json(error("General Error", {error: err}, res.statusCode));
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await User.destroy({
      where: {
        id: id
      }
    })
    .then(data => {
      if(data == 0) {
        res
          .status(400)
          .json(error("Id not found!", res.statusCode));
      };

      if(data > 0) {
        res
          .status(200)
          .json(success("Success delete user", res.statusCode));
      };
    })
    .catch (err => {
      res.status(500).send({
        message: err.message
      })
    })
  } catch (error) {
    res
      .status(500)
      .json(error("General Error", {error: error}, res.statusCode));
  }
}

exports.deleteAll = async (req, res) => {
  try {
    await User.truncate()
    .then(() => {
      res
        .status(200)
        .json(success("Success delete all user", res.statusCode));
    })
    .catch (err => {
      res
        .status(500)
        .json(error("General Error", {error: err}, res.statusCode));
    })
  } catch (err) {
    res
      .status(500)
      .json(error("General Error", {error: err}, res.statusCode));
  }
}

