const Queue =  require('bull');
require('dotenv').config();

const REDIS_URL = process.env.REDIS_URL;
const sendMailQueue = new Queue('sendMail', REDIS_URL);

module.exports = sendMailQueue;
