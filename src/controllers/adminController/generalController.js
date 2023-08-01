const db = require('../../config/db');

validateValue = (value) => {
    if (value !== "" && value !== null && value !== undefined) {
      return true;
    } else {
      return false;
    }
};

exports.orderhistory = (req, res) =>{
    const email = req.email;
    
    db.query(`SELECT * FROM packages WHERE driver_email='${email}' AND status !='new'`, (err, result)=>{
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

exports.neworder = (req, res) =>{
    const email = req.email;
    
    db.query(`SELECT * FROM packages WHERE status ='new'`, (err, result)=>{
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

exports.couriers = (req, res) =>{
    const email = req.email;

    db.query(`SELECT * FROM drivers`,(err, result)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message: 'An error occured'
            })
        }else{
            return res.status(200).json({
                error: false,
                message: result
            })
        }
    })
}

exports.approvecourier=(req, res) =>{
    const email = req.email;
    const {driver_email} = req.body;

    db.query(`UPDATE drivers SET validated='yes' WHERE email='${driver_email}'`,(err, result)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message: 'An error occur'
            })
        }else{
            return res.status(200).json({
                error:false,
                message: 'Courier Approved Successfully'
            })
        }
    })
}

exports.assigndriver = (req, res) =>{
    const email = req.email;
    const {tracking_id, driver_email} = req.body;

    if(validateValue(tracking_id) && validateValue(driver_email)){
        db.query(`UPDATE packages SET driver_email='${driver_email}' WHERE tracking_id='${tracking_id}'`,(err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "An error occured, please reload."
                })
            }else{
                return res.status(200).json({
                    error:false,
                    message: "Package assigned to driver."
                })
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message: "All fields are required."
        })
    }

}