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
    
    db.query(`SELECT * FROM packages WHERE status='new' OR status=''`, (err, result)=>{
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
    db.query(`SELECT * FROM packages WHERE AND tracking_id='${tracking_id}'`, (err, result)=>{
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
    const couriers = [];

    db.query(`SELECT * FROM drivers`,(err, result)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message: 'An error occured'
            })
        }else{
            for (let i = 0; i < result.length; i++) {
                let profiles = result[i];
                const element = result[i].email;
                db.query(`SELECT * FROM account_details WHERE email='${element}';SELECT * FROM vehicles WHERE driver_email='${element}'`,(err, results)=>{
                    if(err){
                        return res.status(400).json({
                            error: true,
                            message: 'An error occured'
                        })
                    }else{
                        const [r1, r2] = results;
                        couriers.push({
                            profile: profiles,
                            vehicle: r2[0],
                            account_details: r1[0]
                        });
                    }
                })
            }
            
            setTimeout(()=>{
                return res.status(200).json({
                    error: false,
                    message: couriers
                });
            }, 4000)
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

exports.declineorder=(req, res)=>{
    const email = req.email;
    const {tracking_id} = req.body;

    if(validateValue(tracking_id)){
        db.query(`UPDATE packages SET status='reject' WHERE tracking_id='${tracking_id}'`, (err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "An error occured please, retry."
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: "Order rejected"
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

exports.totalamount = (req, res) =>{
    const email = req.email;
    db.query(`SELECT SUM(trip_fare) AS total_amount FROM packages WHERE status='completed' AND payment_status='success' OR  status='completed' AND payment_status='successful'`,(err, result)=>{
        if(err){
            return res.status(400).json({
                error: true,
                message: "an error occurred please reload.",
                data: []
            })
        }else{
            return res.status(200).json({
                error: false,
                message: "All funds calculated together.",
                data: result
            })
        }
    })
}