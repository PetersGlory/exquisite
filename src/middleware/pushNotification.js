const FCM = require('fcm-node');
const serverKey = require('../../exquisite_firebase.json');

const push = new FCM(serverKey);

pushNotification =({token, title, body, type, content}) => {
    const payload = {
        to: token,
        notification: {
            title: title,
            body: body,
            sound: "default",
            icon: 'https://exquisite.essenceofgreenfield.com/image/logo.png',
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
        },
        data: {
            data1: type,
            data2: content
        }
    };

    const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24 //24 hours
    };
    
    push.send(payload, function(err, response) {
        if (err) {
            return;
        } else {
            return;
        }
    })
}

module.exports = pushNotification;