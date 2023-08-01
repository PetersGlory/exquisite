const jwt = require("jsonwebtoken");
const userkey = process.env.ACCESS_TOKEN_SECRET_TEXT;
const driverkey = process.env.ACCESS_TOKEN_SECRET_TEXT;


authenticateToken = (req, res, next) => {
    const authHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "You're Logged Out, please login", authHead: req.headers, loggedOut: true });
    } else {

        jwt.verify(token, userkey, (err, email) => {
            if (err) return res.status(403).json({ error: true, message: "Token invalid" });

            req.email = email;
            // console.log(req.email);
            next();
        })
    }
}

driverAuthenticateToken = (req, res, next) => {
    const authHeader = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null || token == "" || token == undefined) {
        return res.status(401).json({ error: true, message: "You're Logged Out, please login", authHead: req.headers, loggedOut: true });
    } else {

        jwt.verify(token, driverkey, (err, email) => {
            if (err) return res.status(403).json({ error: true, message: "Token invalid" });

            req.email = email;
            // console.log(req.email);
            next();
        })
    }
}


module.exports = authenticateToken , driverAuthenticateToken;