const db = require('../../config/db');
function trackOrder(io,data){
    let trackId = data.tracking_id;
    let user = data.email;

    db.query(`SELECT * FROM packages WHERE tracking_id=?`, [trackId], (err, result)=>{
        if(err){
            return io.to(user).emit(json({
                error: true,
                message: 'Unable to connect to database.'
            }));
        }else{
            if(result.length > 0){
                return io.to(user).emit(json({
                    error: false,
                    message: 'Order information',
                    data: result
                }));
            }else{
                return io.to(user).emit(json({
                    error: true,
                    message: 'No order found.'
                }));
            }
        }
    })
}

function chatwithdriver(data){
    const {receiver_email, sender_email} = data;
    
}

module.exports = { trackOrder };