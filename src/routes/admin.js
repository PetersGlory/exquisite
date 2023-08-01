const express = require("express");
const adminRoutes = express.Router();
const authentication = require('../controllers/adminController/authentication');
const generalController = require('../controllers/adminController/generalController');
const authenticateToken = require("../middleware/validateUser");

adminRoutes.post('/authenticate', authentication.login);
adminRoutes.post('/verify/code', authentication.verifyCode);


adminRoutes.get('/order-history', authenticateToken, generalController.orderhistory);
adminRoutes.get('/couriers', authenticateToken, generalController.couriers);
adminRoutes.post('/courier/approve', authenticateToken, generalController.approvecourier);
adminRoutes.post('/order-by-id', authenticateToken, generalController.orderhistorybyid);
adminRoutes.post('/order/assign', authenticateToken, generalController.assigndriver);

module.exports = adminRoutes;