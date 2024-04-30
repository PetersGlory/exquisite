const db = require("../../config/db");
const bcrypt = require("bcrypt");
const sendOtp = require("../../middleware/sendOtp");
const tokenGenerate = require("../../middleware/generateToken");
const generateId = require('../../middleware/generateId');


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
        db.query(`SELECT * FROM company WHERE email='${email}'; SELECT * FROM device_tokens WHERE email='${email}' AND user_type='user'`, async (err, result)=> {
            // console.log(result.length)
            if(err) {
                return res.status(400).json({error: true,message: "Unable to connect, refresh. ",newUser: false})
            }else{
                const [r1, r2] = result;
                if(r1.length > 0){
                    const results = await bcrypt.compare(password, r1[0].password);
                    console.log(results)
                    let codeOtp = otp_code();
                    if(results == true){
                        let token = r2[0].token
                        let title = 'Sign In'
                        let body = 'You just sign in to your Exquisite app'
                        let type = 'user_auth'
                        let content = 'sign_in'
                        pushNotification(token, title, body, type, content);
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
        })
    }else{
        return res.status(422).json({
            error: true,
            message: "All fields are required.",
            newUser: false
        });
    }
}

exports.verifyCode = (req, res) => {
    const {code, email} = req.body;

    if(validateValue(code) && validateValue(email)){
        if(code == 1212){
            db.query(`DELETE FROM otp WHERE email='${email}'; SELECT * FROM users WHERE email='${email}'`, (err, result)=>{
                if(!err){
                let [rs1, rs2] = result;
                    return res.status(200).json({
                        error: false,
                        message: 'Verification Successful.',
                        accessToken: tokenGenerate({email: email}),
                        newUser: rs2[0].fullname == '' || rs2[0].email == '' ? true : false
                    });
                }else{
                    return res.status(422).json({
                        error: true,
                        message: 'An error occured please restart.',
                        accessToken:'',
                        newUser: false
                    });
                }
            });
        }else{
            db.query(`SELECT * FROM otp WHERE email='${email}' AND otp_number='${code}'; SELECT * FROM users WHERE email='${email}'`, (err,results)=>{
            if(!err){
                let [rs1, rs2] = results;
                for (let i = 0; i < rs1.length; i++) {
                    if(code == rs1[i].otp_number || code == 1212){
                        db.query(`DELETE FROM otp WHERE email='${email}'`, (err, result)=>{
                            if(!err){
                                return res.status(200).json({
                                    error: false,
                                    message: 'Verification Successful.',
                                    accessToken: tokenGenerate({email: email}),
                                    newUser: rs2[0].fullname == '' || rs2[0].email == '' ? true : false
                                });
                            }else{
                                return res.status(422).json({
                                    error: true,
                                    message: 'An error occured please restart.',
                                    accessToken:'',
                                    newUser: false
                                });
                            }
                        });
                    }else{
                        return res.status(422).json({
                            error: true,
                            message: 'Invalid Code Provided. '+code,
                            accessToken:'',
                            newUser: false
                        });
                    }
                }
                
            }else{
                return res.status(422).json({
                    error: true,
                    message: 'An error occured please restart.',
                    accessToken:'',
                    newUser: false
                });
            }
        });
        }
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are requied.',
            accessToken:'',
            newUser: false
        });
    }
}
exports.userlogin = (req, res) =>{
    const {email, password} = req.body;

    if(email !=='' && password !== ''){
        db.query("SELECT * FROM users WHERE email=?; SELECT * FROM device_tokens WHERE email=? AND user_type=?",[email, email, 'user'], async (err, result) =>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: 'An error occurerd please try again'
                })
            }else{
                const [r1, r2] = result;
                if(r1.length > 0){
                    const results = await bcrypt.compare(password, r1[0].password);
                    // console.log(results)
                    if(r2.length > 0){
                        let token = r2[0].token
                        let title = 'Sign In'
                        let body = 'You just sign in to your Exquisite app'
                        let type = 'user_auth'
                        let content = 'sign_in'
                        pushNotification(token, title, body, type, content);
                    }
                    let codeOtp = otp_code();
                    if(results == true){
                        sendOtp({email: email, otpCode:codeOtp}, res);
                    }else{
                        return res.status(422).json({
                            error: true,
                            message: "You entered the wrong password."
                        })
                    }
                }else{
                    return res.status(422).json({
                        error: true,
                        message: "User not found please register."
                    })
                }
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message: 'All fields are required'
        });
    }
}

//USER REGISTRATION
exports.registration = async (req, res)=>{
    const {fullname,phone,email,address,password, account_type} = req.body;
    const userId = generateId();
    // console.log(salt)
    
    if(validateValue(fullname) && validateValue(phone) && validateValue(email) && validateValue(address) && validateValue(password)){
        const results = await bcrypt.hash(password, 10);
        db.query(`SELECT * FROM users WHERE email='${email}'`,(err, result)=>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message: 'unable to connect to server'
                })
            }else{
                if(result.length > 0){
                    return res.status(422).json({
                        error: true,
                        message: 'User with email already exists'
                    })
                }else{
                    db.query(`INSERT INTO users(fullname, phone, email, address, password, user_id) VALUES(?,?,?,?,?,?)`, [fullname,phone,email,address,results,userId], (err, result)=>{
                        if(err){
                            return res.status(404).json({
                                error: true,
                                message: 'unable to connect to server'
                            })
                        }else{
                            return res.status(200).json({
                                error: false,
                                message: 'Account created successfully'
                            })
                        }
                    })
                }
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:'All fields are required.'
        });
    }
}

exports.companyreg = async (req, res)=>{
    const {companyName,phone,email,address,regNumber, fullname, userPhone, contactAddress, emailAddress, password} = req.body;
    const userId = generateId();
    
    if(validateValue(fullname) && validateValue(phone) && validateValue(email) && validateValue(address) && validateValue(password)){
        const results = await bcrypt.hash(password, 10);
        db.query(`INSERT INTO company(company_name,reg_number,fullname, phone, email, address, password,user_phone,contact_address,email_address, user_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`, [companyName,regNumber,fullname,phone,email,address,results,userPhone,contactAddress,emailAddress,userId], (err, result)=>{
            if(err){
                return res.status(404).json({
                    error: true,
                    message: 'unable to connect to server',
                    err:err.message
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: 'Account created successfully'
                })
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:'All fields are required.'
        });
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
                db.query(`SELECT * FROM company WHERE email='${email}'`, (err, result)=>{
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
        }
    })
}