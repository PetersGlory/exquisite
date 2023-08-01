const db = require("../config/db");

function chatAI(data){
    const {sender_email, receiver_email} = data;

    db.query(`SELECT * FROM messages WHERE sender_email='${sender_email}' AND receiver_email='${receiver_email}' OR receiver_email='${sender_email}' AND sender_email='${receiver_email}'`,(err, result)=>{
        if(err){
            return io.to(sender_email).emit(json({
                error: true,
                message: 'an error occured'
            }))
        }else{
            return io.to(sender_email).emit(json({
                error:false,
                message: 'This are your messages',
                result_data: result
            }))
        }
    })
}

module.exports = { chatAI };