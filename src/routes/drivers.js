const express = require("express");
const driversRoute = express.Router();
const authentication = require('../controllers/driverController/authentication');
const profileController = require('../controllers/driverController/profileController');
const driverIoFunctions = require('../controllers/driverController/driverIoFunctions');
const authenticateToken = require("../middleware/validateUser");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/profile_pics/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date() + "_" + file.originalname)
    }
})

const maxSize = 6 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
})


//Authentication
driversRoute.post('/authenticate', authentication.login);
driversRoute.post('/verify/code', authentication.verifyCode);
driversRoute.post('/registeration', authentication.registration);
driversRoute.post('/registration/vehicle', authentication.vehicleregistration);
driversRoute.post('/registration/document', authentication.documentregistration);
driversRoute.post('/registration/bank_account', authentication.bankaccount);
driversRoute.post('/forget/password', authentication.forgetpassword);


//User Profile Information
driversRoute.get('/profile', authenticateToken, profileController.driverprofile);
driversRoute.post('/update/profile', authenticateToken, profileController.updateprofile);
// driversRoute.post('/visibility', authenticateToken, profileController.visibility);

//Ride Ednpoints
driversRoute.get('/order-history', authenticateToken, profileController.orderhistory);
driversRoute.post('/order-by-id', authenticateToken, profileController.orderhistorybyid);
// driversRoute.get('/today-rides', authenticateToken, rideController.getTodayRide);
driversRoute.get('/get-rides', authenticateToken, profileController.getorders);
driversRoute.post('/withdraw', authenticateToken, profileController.withdraw);
driversRoute.post('/order/accept', authenticateToken, driverIoFunctions.acceptorder);
driversRoute.post('/order/decline', authenticateToken, driverIoFunctions.declineorder);
driversRoute.get('/transactions', authenticateToken, profileController.gettransactions);
module.exports = driversRoute;