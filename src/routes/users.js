const express = require("express");
const usersRoute = express.Router();
const authController = require('../controllers/userController/authentication');
const profileController = require('../controllers/userController/profileController');
// const rideController = require('../controllers/usersControllers/rideController');

const authenticateToken = require("../middleware/validateUser");

//Authentication
usersRoute.post('/authenticate', authController.userlogin);
usersRoute.post('/verify/code', authController.verifyCode);
usersRoute.post('/registration', authController.registration);
usersRoute.post('/company/registration', authController.companyreg);
usersRoute.post('/company/authenticate', authController.login);
usersRoute.post('/forget/password', authController.forgetpassword);

// usersRoute.post('/completeReg', authenticateToken, authController.registration);

//User Profile Information
usersRoute.post('/review-driver', authenticateToken, profileController.reviewdriver);
usersRoute.get('/profile', authenticateToken, profileController.userprofile);
usersRoute.post('/update/profile', authenticateToken, profileController.updateprofile);
// usersRoute.post('/nearbydrivers', authenticateToken, rideController.getLocation);

//Ride Flow
usersRoute.post('/create/order', authenticateToken, profileController.orderpackage);
usersRoute.post('/update/order-payment', authenticateToken, profileController.updateridepayment);
usersRoute.get('/order-history', authenticateToken, profileController.orderhistory);
usersRoute.post('/order-by-id', authenticateToken, profileController.orderhistorybyid);
usersRoute.post('/add-card', authenticateToken, profileController.addcard);
usersRoute.post('/add-transaction', authenticateToken, profileController.addtransaction);
usersRoute.get('/transactions', authenticateToken, profileController.gettransactions);
usersRoute.post('/courier/profile', authenticateToken, profileController.getcourier);
usersRoute.delete('/delete', authenticateToken, profileController.deleteAccount);
// usersRoute.get('/all-rides', authenticateToken, rideController.getAllRide);

module.exports = usersRoute;