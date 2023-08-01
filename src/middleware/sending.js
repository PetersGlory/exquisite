const nodemailer = require('nodemailer');

const sending = nodemailer.createTransport({
    host: 'exquisite.essenceofgreenfield.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@exquisite.essenceofgreenfield.com',
        pass: 'scalypjw_exquisite',
    }
});


module.exports = sending