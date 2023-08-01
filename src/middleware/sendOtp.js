const axios = require("axios");
const db = require("../config/db");
const sending = require('../middleware/sending');
sendOtp = ({ email, otpCode },res) => {
    db.query(`INSERT INTO otp (email,otp_number)VALUES('${email}','${otpCode}')`, async (err, results)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message: "Unable to connect, refresh."
            });
        }else{
            await sending.sendMail({
                from: "Exquisite 👻 '<info@exquisite.essenceofgreenfield.com>'",
                to: email,
                subject: 'Verification Code',
                html: `
                <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Exquisite</a>
                </div>
                <p style="font-size:1.1em">Hi ${email},</p>
                <p>Use the following OTP to reset your password. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otpCode}</h2>
                <p style="font-size:0.9em;">Regards,<br />Exquisite</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Exquisite Inc</p>
                </div>
                </div>
                </div>
                `,
            })
            return res.status(200).json({
                error: false,
                message: `A verification code has been sent to ${email}.`
            });
        }
    })
}


module.exports = sendOtp;