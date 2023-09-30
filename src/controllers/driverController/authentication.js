const db = require("../../config/db");
const bcrypt = require("bcrypt");
const sendOtp = require("../../middleware/sendOtp");
const tokenGenerate = require("../../middleware/generateToken");
const generateId = require('../../middleware/generateId');
const pushNotification = require('../../middleware/pushNotification');
// const sending = require('../../middleware/sending');


otp_code = () =>{
    const random = Math.floor(Math.random() * 9000 + 1000);
    return random;
}

const salt = bcrypt.genSalt(10);

validateValue = (value) =>{
    if(value !== "" && value !==null && value !==undefined){
        return true;
    }else{
        return false;
    }
}

exports.login = (req, res)=>{
    const {email, password} = req.body;

    if(email !== null && email !== ""){
        db.query("SELECT * FROM drivers WHERE email=?; SELECT * FROM device_tokens WHERE email=? AND user_type=?",[email, email, 'driver'], async (err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "Unable to connect, refresh. Login",
                    error_msg: err
                });
            }else{
                
                const [r1, r2] = result;
                if(r1.length > 0){
                    const results = await bcrypt.compare(password, r1[0].password);
                    let codeOtp = otp_code();
                    if(results){
                        if(r2.length > 0){
                            let token = r2[0].token
                            let title = 'Sign In'
                            let body = 'You just sign in to your Exquisite app'
                            let type = 'driver_auth'
                            let content = 'sign_in'
                            pushNotification(token, title, body, type, content);
                        }
                        sendOtp({email: email, otpCode:codeOtp}, res);
                    }else{
                        return res.status(422).json({
                            error: true,
                            message: "You entered the wrong password.",
                            newUser: false
                        })
                    }
                }else{
                    return res.status(422).json({
                        error: true,
                        message: "User not found please register.",
                        newUser: false
                    })
                }
            }
        });
    }else{
        return res.status(422).json({
            error: true,
            message: "Please enter a valid Mobile number.",
            newUser: false
        });
    }
}

exports.verifyCode = (req, res) => {
    const {code, email} = req.body;

    if(validateValue(code) && validateValue(email)){
        db.query(`SELECT * FROM otp WHERE email='${email}' AND otp_number='${code}'; SELECT * FROM drivers WHERE email='${email}'`, (err,results)=>{
            if(!err){
                let [rs1, rs2] = results;
                for (let i = 0; i < rs1.length; i++) {
                    if(code == rs1[i].otp_number){
                        db.query(`DELETE FROM otp WHERE email='${email}'`, (err, result)=>{
                            if(!err){
                                return res.status(200).json({
                                    error: false,
                                    message: 'Verification Successful.',
                                    accessToken: tokenGenerate({email: email}),
                                    newUser: rs2[0].fullname == '' || rs2[0].email == '' ? true : false,
                                    driverApproved: rs2[0].validated == 'no' ? false : true
                                });
                            }else{
                                return res.status(422).json({
                                    error: true,
                                    message: 'An error occured please restart.',
                                    accessToken:'',
                                    newUser: false,
                                    driverApproved: false
                                });
                            }
                        });
                    }else{
                        return res.status(422).json({
                            error: true,
                            message: 'Invalid Code Provided. '+code,
                            accessToken:'',
                            newUser: false,
                            driverApproved: false
                        });
                    }
                }
                
            }else{
                return res.status(422).json({
                    error: true,
                    message: 'An error occured please restart.',
                    accessToken:'',
                    newUser: false,
                    driverApproved: false
                });
            }
        });
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are requied.',
            accessToken:'',
            newUser: false
        });
    }
}

exports.registration = async (req, res) =>{
    const {
        firstname,lastname,dob,email,phone,password
    } = req.body;
    let driverId = generateId();

    if(validateValue(firstname) && validateValue(lastname) && validateValue(dob) && validateValue(email) && validateValue(phone)){
        const results = await bcrypt.hash(password, 10);
        db.query(`INSERT INTO drivers(firstname, lastname, email, dob, phone, password, user_id) VALUES(?,?,?,?,?,?,?)`, [firstname,lastname,email,dob,phone,results,driverId], (err, result)=>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message:'something went wrong try again later.'
                });
            }else{
                return res.status(200).json({
                    error: false,
                    message:'Personal Information registered.'
                });
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:'All fields are required.'
        });
    }
}


exports.vehicleregistration = (req, res) =>{
    const {
        vehicle_name, vehicle_model, vehicle_year, vehicle_color, plate_number, address, vehicle_img, vehicle_type, license, email
    } = req.body;

    if(
        validateValue(vehicle_name) && validateValue(vehicle_model) && validateValue(vehicle_year) && validateValue(vehicle_type)
        && validateValue(vehicle_color) && validateValue(plate_number) && validateValue(address) && validateValue(vehicle_img) && validateValue(license)
    ){
        db.query(`INSERT INTO vehicles(vehicle_name, vehicle_model, vehicle_year, vehicle_color, vehicle_type, plate_number, license, driver_email,car_img) VALUES (?,?,?,?,?,?,?,?,?)`,[vehicle_name,vehicle_model,vehicle_year, vehicle_color,vehicle_type, plate_number, license,email,vehicle_img], (err, result)=>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message: 'Something went wrong try again later.'
                    // err_message: err
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: 'Vehicle registration successful.',
                });
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are required.'
        });
    }
}

exports.documentregistration = (req, res)=>{
    const {
        id_number, issue_date, id_img, profile_pic, email
    } = req.body;

    if(validateValue(id_number) && validateValue(issue_date) && validateValue(id_img) && validateValue(profile_pic)&& validateValue(email)){
        db.query(`UPDATE vehicles SET id_number=?, id_issue_date=?, id_img=? WHERE driver_email=?;UPDATE drivers SET user_img='${profile_pic}' WHERE email='${email}'`, [id_number,issue_date,id_img,email], (err, result)=>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message: 'Something went wrong try again later.'
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: 'Identity registration successful.',
                });
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are required.'
        });
    }
}

exports.bankaccount = (req, res) =>{
    const {
        bank_holder_name, account_number, bank_name, email
    } = req.body;

    if(validateValue(bank_holder_name) && validateValue(account_number) && validateValue(bank_name)&& validateValue(email)){
        db.query(`INSERT INTO account_details(account_name,account_number,bank_name,email)VALUES(?,?,?,?)`,[bank_holder_name, account_number, bank_name, email], (err, result) =>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message: 'Something went wrong try again later.'
                    // err_message: err
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: 'Bank account registration successful.',
                });
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are required'
        })
    }
}


exports.forgetpassword = (req, res) =>{
    const {email} = req.body;

    db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result)=>{
        if(err){
            return res.status(404).json({
                error: true,
                message: 'unable to connect to server'
            })
        }else{
            if(result.length > 0){
                let codeOtp = otp_code();
                sendOtp({email: email, otpCode:codeOtp}, res);
            }else{
                return res.status(422).json({
                    error: false,
                    message: 'Email not registered'
                })
            }
        }
    })
}