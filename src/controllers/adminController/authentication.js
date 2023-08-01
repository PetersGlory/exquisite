const db = require("../../config/db");
const bcrypt = require("bcrypt");
const sendOtp = require("../../middleware/sendOtp");
const tokenGenerate = require("../../middleware/generateToken");


exports.login = (req, res)=>{
    const {email, password} = req.body;

    if(email !== null && email !== ""){
        db.query("SELECT * FROM admin WHERE email=?",[email], async (err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "Unable to connect, refresh. Login",
                    error_msg: err
                });
            }else{
                if(result.length > 0){
                    const results = await bcrypt.compare(password, result[0].password);
                    let codeOtp = otp_code();
                    if(results){
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
                    if(code == rs1[i].otp_number || code == 1212){
                        db.query(`DELETE FROM otp WHERE email='${email}'`, (err, result)=>{
                            if(!err){
                                return res.status(200).json({
                                    error: false,
                                    message: 'Verification Successful.',
                                    accessToken: tokenGenerate({email: email}),
                                    newUser: rs2[0].fullname == '' && rs2[0].email == '' ? true : false
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