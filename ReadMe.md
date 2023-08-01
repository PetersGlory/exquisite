This is the readme File for the Exquisite Application Backend
<br />

All the endpoints controller, middleware, routes and the config file would be found in the "./src" Folder. <br />

<ul>
    <li>
        <b>Controllers Folder:</b> <br /> In the controllers folder you'll see the controllers for users, couriers, admin and the general contollers file seperated into different folders and in each folders contains "authContoller.js","profileController.js" and "...IoFunction.js", the "./authController.js" contains the authentication parts which is the login, code verification and registration endpoints, while the "./profileController.js" file contains the endpoints for updating profile, ordering (users), receiveing orders(couriers) and also others.
    </li>
    <li>
        <b>Config Folder:</b> <br /> In the Config folder you'll see a file called "./db.js" there you can create a db connection with the server and so on.
    </li>
    <li>
        <b>Middleware Folder:</b> <br /> In the Middleware folder you'll see the middlewares for users, couriers, admin and the general there you'll see files like "generateToken.js", "chat.js","generateId.js", "sending.js", "sendOtp.js" and "validateUser.js".
    </li>
</ul>