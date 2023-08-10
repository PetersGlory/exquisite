const db = require('../../config/db');

validateValue = (value) => {
    if (value !== "" && value !== null && value !== undefined) {
      return true;
    } else {
      return false;
    }
};


exports.driverprofile = (req, res)=>{
    const email = req.email;

    db.query(`SELECT * FROM drivers WHERE email='${email}'`, (err, result)=>{
        if(err){
            return res.status(404).json({
                error: true,
                message: 'Unable to connect to the server please reload',
                data: {}
            });
        }else{
            
            return res.status(200).json({
                error: false,
                message: 'your profile is listed below',
                data: result[0]
            });
        }
    })
}

exports.updateprofile = (req, res)=>{
    const email = req.email;
    const {firstname, lastname,gender, emergency_contact, user_img} = req.body;

    db.query(`UPDATE drivers SET firstname=?,lastname=?, gender=?, emergency_contact=?, user_img=? WHERE email=?`, [firstname,lastname, gender, emergency_contact,user_img, email], (err, result)=>{
        if(err){
            return res.status(404).json({
                error: true,
                message: 'something went wrong try again later.',
                err: err.message
            })
        }else{
            return res.status(200).json({
                error: false,
                message: 'Your profile has been updated.'
            })
        }
    })
}

exports.orderhistory = (req, res) =>{
    const email = req.email;
    
    db.query(`SELECT * FROM packages WHERE driver_email='${email}'`, (err, result)=>{
        if (err) {
            return res.status(400).json({
                error: true,
                message: 'an error occured'
            })
        } else {
            if(result.length > 0){
                return res.status(200).json({
                    error: false,
                    message: result
                })
            }else{
                return res.status(422).json({
                    error: false,
                    message: "No Order Found."
                })
            }
        }
    })
}

exports.orderhistorybyid = (req, res) =>{
    const email = req.email;
    const{tracking_id} = req.body;
    db.query(`SELECT * FROM packages WHERE driver_email='${email}' AND tracking_id='${tracking_id}'`, (err, result)=>{
        if (err) {
            return res.status(400).json({
                error: true,
                message: 'an error occured'
            })
        } else {
            if(result.length > 0){
                return res.status(200).json({
                    error: false,
                    message: result
                })
            }else{
                return res.status(422).json({
                    error: false,
                    message: "No Order Found."
                })
            }
        }
    })
}

exports.getorders = (req, res) =>{
    const email = req.email;

    db.query(`SELECT * FROM packages WHERE driver_email='${email}' AND status='new' OR driver_email='${email}' AND status=''`,(err, result)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message:'An error occured. Reload'
            })
        }else{
            if(result.length > 0){
                return res.status(200).json({
                    error: false,
                    message:'New rides',
                    data: result
                })
            }else{
                return res.status(422).json({
                    error: true,
                    message:'No order found.',
                    data: result
                })
            }
        }
    })
}

exports.withdraw = (req, res) =>{
    const email = req.email;
    const {amount} = req.body;

    if(validateValue(amount)){
        db.query(`SELECT * FROM drivers WHERE email='${email}'`,(err, result) =>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message:'An error occured. Reload'
                })
            }else{
                if(result.length > 0){
                    if(Number(result[0].wallet_amount) >= Number(amount)){
                        db.query("INSERT INTO withdrawal_requests(email, amount)VALUES(?,?)",[email, amount],(err, results)=>{
                            if(err){
                                return res.status(400).json({
                                    error: true,
                                    message:'An error occured while adding your records. Reload'
                                })
                            }else{
                                return res.status(200).json({
                                    error: false,
                                    message:'Your request has been recorded and passed to the Administrators for validation.'
                                })
                            }
                        })
                    }else{
                        return res.status(422).json({
                            error: true,
                            message:'Insufficient funds'
                        })
                    }
                }else{
                    return res.status(422).json({
                        error: true,
                        message:'Profile not found'
                    })
                }
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:'All fields are required'
        })
    }
}


exports.gettransactions = (req, res) => {
    const email = req.email;
  
    db.query(
      `SELECT * FROM transactions WHERE email='${email}'`,
      (err, result) => {
        if (err) {
          return res.status(404).json({
            error: true,
            message: "Unable to connect.",
          });
        } else {
          if (result.length > 0) {
            return res.status(200).json({
              error: false,
              message: result,
              text: "Transaction success",
            });
          } else {
            return res.status(422).json({
              error: false,
              message: result,
              text: "No transaction found.",
            });
          }
        }
      }
    );
  };