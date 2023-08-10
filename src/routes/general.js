const express = require("express");
const routes = express.Router();
const controllers = require('../controllers/controller');

const usersId = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const multer = require('multer');
const { Router } = require('express');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/image/')
    },
    filename: function(req, file, cb) {
        cb(null, usersId() + "_" + file.originalname)
    }
})

const maxSize = 6 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
})

routes.post('/upload', upload.single('filetoupload'), controllers.imageUpload)
routes.post('/resend/otp', controllers.resendotp)
routes.post('/notifications', controllers.notification);
routes.post('/device_token', controllers.devicetokens);

module.exports = routes;