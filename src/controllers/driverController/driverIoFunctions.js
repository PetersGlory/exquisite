const db = require('../../config/db');

validateValue = (value) => {
    if (value !== "" && value !== null && value !== undefined) {
      return true;
    } else {
      return false;
    }
};


exports.acceptorder = (req, res) =>{
    const email = req.email;
    const {tracking_id} = req.body;

    if(validateValue(tracking_id)){
        db.query(`UPDATE packages SET status='accepted' WHERE driver_email='${email}' AND tracking_id='${tracking_id}'`,(err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "An error occured, please reload."
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: "Package Accepted"
                })
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:"All fields are required."
        })
    }
}

exports.declineorder = (req, res) =>{
    const email = req.email;
    const {tracking_id} = req.body;

    if(validateValue(tracking_id)){
        db.query(`UPDATE packages SET status='new' WHERE driver_email='${email}' AND tracking_id='${tracking_id}'`,(err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "An error occured, please reload."
                })
            }else{
                return res.status(200).json({
                    error: false,
                    message: "Package Declined"
                })
            }
        })
    }else{
        return res.status(422).json({
            error: true,
            message:"All fields are required."
        })
    }
}

exports.getuser=(req, res) =>{
    const email = req.email;
    const { user_email } = req.body;
  
    db.query(
      `SELECT * FROM users WHERE email='${user_email}'`,
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
                message: "Courier Profile",
                profile: result[0],
            });
          } else {
            return res.status(422).json({
              error: true,
              message: "Profile not found",
            });
          }
        }
      }
    );
}

exports.updateorder = (req, res) =>{
    const email = req.email;
    const {tracking_id, status} = req.body;

    if(validateValue(tracking_id) && validateValue(status)){
        db.query(`UPDATE packages SET status='${status}' WHERE tracking_id='${tracking_id}' AND driver_email='${email}'`,(err, result)=>{
            if(err){
                return res.status(400).json({
                    error: true,
                    message: "An error occured please reload."
                })
            }else{
                return res.status(200).jon({
                    error: false,
                    message: "Order Updated"
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