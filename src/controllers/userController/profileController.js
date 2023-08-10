const db = require("../../config/db");
const pushNotification = require('../../middleware/pushNotification');

// FUNCTIONS HERE
// Current Date
const dty = new Date();

let current_date =
  dty.getFullYear() + "-" + dty.getMonth() + "-" + dty.getDate();

let day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
][new Date().getDay()];
let monthName = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
][new Date().getMonth()];

let ordering_date =
  day + ", " + monthName + " " + dty.getDate() + "," + dty.getFullYear();
// ride Id
const trackingId = () => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return "EXQ-" + text + dty.getMinutes();
};

validateValue = (value) => {
  if (value !== "" && value !== null && value !== undefined) {
    return true;
  } else {
    return false;
  }
};

function degreesToRadians(degrees) {
  var radians = (degrees * Math.PI) / 180;
  return radians;
}

function calcDistance(lat, log, deslat, deslog) {
  let startingLat = degreesToRadians(lat);
  let startingLong = degreesToRadians(log);
  let destinationLat = degreesToRadians(deslat);
  let destinationLong = degreesToRadians(deslog);

  // Radius of the Earth in kilometers
  let radius = 6571;

  // Haversine equation
  let distanceInKilometers =
    Math.acos(
      Math.sin(startingLat) * Math.sin(destinationLat) +
        Math.cos(startingLat) *
          Math.cos(destinationLat) *
          Math.cos(startingLong - destinationLong)
    ) * radius;

  return distanceInKilometers;
}

// percentage Calculation
percentages = (partialValue, totalValue) => {
  let percent = (partialValue / 100) * totalValue;
  let percenta = percent.toFixed(2);
  return percenta;
};

// ENDPOINTS STARTS HERE

exports.userprofile = (req, res) => {
  const email = req.email;

  db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
    if (err) {
      return res.status(404).json({
        error: true,
        message: "Unable to connect to the server please reload",
        data: {},
      });
    } else {
      if (result.length > 0) {
        return res.status(200).json({
          error: false,
          message: "your profile is listed below",
          data: result[0],
        });
      } else {
        db.query(
          `SELECT * FROM company WHERE email='${email}'`,
          (err, result) => {
            if (err) {
              return res.status(404).json({
                error: true,
                message: "Unable to connect to the server please reload",
                data: {},
              });
            } else {
              if (result.length > 0) {
                return res.status(200).json({
                  error: false,
                  message: "your profile is listed below",
                  data: result[0],
                });
              } else {
                return res.status(422).json({
                  error: true,
                  message: "Profile not found",
                  data: result[0],
                });
              }
            }
          }
        );
      }
    }
  });
};

exports.reviewdriver = (req, res) => {
  const email = req.email;
  const { rate, driver_email, review_content, trackingId } = req.body;

  db.query(
    `INSERT INTO reviews(tracking_id, rater_email, to_rate_email, rate, review_content) VALUES(?,?,?,?,?)`,
    [trackingId, email, driver_email, rate, review_content],
    (err, result) => {
      if (err) {
        return res.status(404).json({
          error: true,
          message: "something went wrong try again later",
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "Driver reviewed successfully.",
        });
      }
    }
  );
};

exports.updateprofile = (req, res) => {
  const email = req.email;
  const { firstname, lastname, gender, emergency_contact, user_img } = req.body;
  let fullname = firstname + " " + lastname;

  db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
    if (err) {
      return res.status(404).json({
        error: true,
        message: "Unable to connect to the server please reload",
        data: {},
      });
    } else {
      if (result.length > 0) {
        if (validateValue(user_img)) {
          db.query(
            `UPDATE users SET fullname=?, gender=?, emergency_contact=?, user_img=? WHERE email=?`,
            [fullname, gender, emergency_contact, user_img, email],
            (err, result) => {
              if (err) {
                return res.status(404).json({
                  error: true,
                  message: "something went wrong try again later.",
                });
              } else {
                return res.status(200).json({
                  error: false,
                  message: "Your profile has been updated.",
                });
              }
            }
          );
        } else {
          db.query(
            `UPDATE users SET fullname=?, gender=?, emergency_contact=? WHERE email=?`,
            [fullname, gender, emergency_contact, email],
            (err, result) => {
              if (err) {
                return res.status(404).json({
                  error: true,
                  message: "something went wrong try again later.",
                });
              } else {
                return res.status(200).json({
                  error: false,
                  message: "Your profile has been updated.",
                });
              }
            }
          );
        }
      } else {
        db.query(
          `SELECT * FROM company WHERE email='${email}'`,
          (err, result) => {
            if (err) {
              return res.status(404).json({
                error: true,
                message: "Unable to connect to the server please reload",
                data: {},
              });
            } else {
              if (result.length > 0) {
                if (validateValue(user_img)) {
                  db.query(
                    `UPDATE company SET fullname=?, gender=?, emergency_contact=?, user_img=? WHERE email=?`,
                    [fullname, gender, emergency_contact, user_img, email],
                    (err, result) => {
                      if (err) {
                        return res.status(404).json({
                          error: true,
                          message: "something went wrong try again later.",
                        });
                      } else {
                        return res.status(200).json({
                          error: false,
                          message: "Your profile has been updated.",
                        });
                      }
                    }
                  );
                } else {
                  db.query(
                    `UPDATE company SET fullname=?, gender=?, emergency_contact=? WHERE email=?`,
                    [fullname, gender, emergency_contact, email],
                    (err, result) => {
                      if (err) {
                        return res.status(404).json({
                          error: true,
                          message: "something went wrong try again later.",
                        });
                      } else {
                        return res.status(200).json({
                          error: false,
                          message: "Your profile has been updated.",
                        });
                      }
                    }
                  );
                }
              } else {
                return res.status(422).json({
                  error: true,
                  message: "Profile not found",
                  data: result[0],
                });
              }
            }
          }
        );
      }
    }
  });
};

exports.orderpackage = (req, res) => {
  const email = req.email;
  const {
    package_name,
    origin,
    origin_lat,
    origin_lng,
    origin_phone,
    destination,
    destination_lat,
    destination_lng,
    package_img,
    package_size,
    destiation_phone,
    trip_type,
    scheduled_dropoff,
    scheduled_pickup,
    package_worth,
  } = req.body;
  let tracking_id = trackingId();
  let distance = `${calcDistance(
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng
  ).toFixed(2)}km`;
  let distances = calcDistance(
    origin_lat,
    origin_lng,
    destination_lat,
    destination_lng
  ).toFixed(2);
  let total_price = (Number(distances) * 1).toFixed(2) * 450;
  let delivery_charge = percentages(total_price, 5);
  if (
    validateValue(origin) &&
    validateValue(package_name) &&
    validateValue(origin_lat) &&
    validateValue(origin_lng) &&
    validateValue(origin_phone) &&
    validateValue(destination) &&
    validateValue(destination_lat) &&
    validateValue(destination_lng) &&
    validateValue(package_img) &&
    validateValue(package_size) &&
    validateValue(package_worth) &&
    validateValue(destiation_phone) &&
    validateValue(trip_type)
  ) {
    db.query(
      "INSERT INTO packages(package_name,package_worth,pickup_address,pickup_lng,pickup_lat,destination,destination_lng,destination_lat,user_email, tracking_id,distance, origin_phone, trip_type,trip_fare,delivery_charge, destination_phone, package_img,package_size,scheduled_pickup,scheduled_dropoff, reg_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        package_name,
        package_worth,
        origin,
        origin_lng,
        origin_lat,
        destination,
        destination_lng,
        destination_lat,
        email,
        tracking_id,
        distance,
        origin_phone,
        trip_type,
        total_price,
        delivery_charge,
        destiation_phone,
        package_img,
        package_size,
        scheduled_pickup,
        scheduled_dropoff,
        ordering_date,
      ],
      (err, result) => {
        if (err) {
          return res.status(400).json({
            error: true,
            message: "An error occured please reload",
            err_msg: err.message,
          });
        } else {
          db.query(
            `SELECT * FROM packages WHERE tracking_id='${tracking_id}'`,
            (err, results) => {
              if (err) {
                return res.status(400).json({
                  error: true,
                  message: "An error occured please reload",
                  err_msg: err.message,
                });
              } else {
                return res.status(200).json({
                  error: false,
                  message: "Order Completed successfully.",
                  order_info: results[0],
                });
              }
            }
          );
        }
      }
    );
  } else {
    return res.status(422).json({
      error: true,
      message: "All fields are required.",
    });
  }
};

exports.updateridepayment = (req, res) => {
  const { tracking_id, payment_status, payment_type } = req.body;
  const email = req.email;

  if (validateValue(tracking_id) && validateValue(payment_status)) {
    db.query(
      `UPDATE packages SET payment_status='${payment_status}',payment_type='${payment_type}' WHERE tracking_id='${tracking_id}' AND user_email='${email}'; SELECT * FROM device_tokens WHERE email='${email}' AND user_type='user'`,
      (err, result) => {
        if (err) {
          return res.status(400).json({
            error: true,
            message: "An error occured please reload",
            err_msg: err.message,
          });
        } else {
          const [r1, r2] = result;
          let token = r2[0].token
          let title = 'Package'
          let body = "You've successfully placed your order"
          let type = 'order'
          let content = 'new_order'
          pushNotification(token, title, body, type, content);
          return res.status(200).json({
            error: false,
            message: "Payment updated successfully.",
          });
        }
      }
    );
  }
};

exports.orderhistory = (req, res) => {
  const email = req.email;

  db.query(
    `SELECT * FROM packages WHERE user_email='${email}'`,
    (err, result) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: "an error occured",
        });
      } else {
        if (result.length > 0) {
          return res.status(200).json({
            error: false,
            message: result,
          });
        } else {
          return res.status(422).json({
            error: false,
            message: "No Order Found.",
          });
        }
      }
    }
  );
};

exports.orderhistorybyid = (req, res) => {
  const email = req.email;
  const { tracking_id } = req.body;
  if(validateValue(tracking_id)){
    db.query(
        `SELECT * FROM packages WHERE user_email='${email}' AND tracking_id='${tracking_id}'`,
        (err, result) => {
          if (err) {
            return res.status(400).json({
              error: true,
              message: "an error occured",
            });
          } else {
            if (result.length > 0) {
              return res.status(200).json({
                error: false,
                message: result,
              });
            } else {
              return res.status(422).json({
                error: false,
                message: "No Order Found.",
              });
            }
          }
        }
      );
  }else{
    return res.status(422).json({
        error: true,
        message:"Order ID is required."
    })
  }
};

exports.addcard = (req, res) => {
  const email = req.email;
  const { card_type, name, card_number, expiry_date, cvv } = req.body;

  if (
    validateValue(card_number) &&
    validateValue(card_type) &&
    validateValue(name) &&
    validateValue(expiry_date) &&
    validateValue(cvv)
  ) {
    db.query(`SELECT * FROM cards WHERE email='${email}';SELECT * FROM device_tokens WHERE email='${email}' AND user_type='user'`, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: "an error occurred",
        });
      } else {
        const [r1, r2] = result;

        if (r1.length > 0) {
          db.query(
            `UPDATE cards SET card_type='${card_type}',name='${name}',cvv='${cvv}', card_number='${card_number}', expiry_date='${expiry_date}' WHERE email='${email}'`,
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: true,
                  message: "an error occurred",
                });
              } else {
                let token = r2[0].token
                let title = 'Card'
                let body = 'Your card has been updated.'
                let type = 'card'
                let content = 'update_card'
                pushNotification(token, title, body, type, content);
                return res.status(200).json({
                  error: false,
                  message: "Card added successfully",
                });
              }
            }
          );
        } else {
          db.query(
            `INSERT INTO cards(card_number, card_type, name, expiry_date,cvv,email)VALUES(?,?,?,?,?,?)`,
            [card_number, card_type, name, expiry_date, cvv,email],
            (err, result) => {
              if (err) {
                return res.status(400).json({
                  error: true,
                  message: "an error occurred",
                });
              } else {
                
                let token = r2[0].token
                let title = 'Card'
                let body = 'Your card has been added'
                let type = 'card'
                let content = 'update_card'
                pushNotification(token, title, body, type, content);
                return res.status(200).json({
                  error: false,
                  message: "Card added successfully",
                });
              }
            }
          );
        }
      }
    });
  }
};

exports.addtransaction = (req, res) => {
  const email = req.email;
  const { amount, tracking_id, payment_status, content } = req.body;

  if (
    validateValue(amount) &&
    validateValue(tracking_id) &&
    validateValue(payment_status) &&
    validateValue(content)
  ) {
    db.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
      if (err) {
        return res.status(404).json({
          error: true,
          message: "Unable to connect.",
        });
      } else {
        if (result.length > 0) {
          let total_amount = eval(
            Number(result[0].wallet_amount) + Number(amount)
          );
          db.query(
            "INSERT INTO transactions(`email`, `amount`, `content`, `tracking_id`, `payment_status`)VALUES(?,?,?,?,?)",
            [email, amount, content, tracking_id, payment_status],
            (err, result) => {
              if (err) {
                return res.status(404).json({
                  error: true,
                  message: "Unable to connect.",
                });
              } else {
                db.query(
                  "UPDATE users SET wallet_amount=? WHERE email=?",
                  [total_amount, email],
                  (err, results) => {
                    if (err) {
                      return res.status(404).json({
                        error: true,
                        message: "Unable to connect.",
                      });
                    } else {
                      return res.status(200).json({
                        error: false,
                        message: "Transaction completed.",
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          db.query(
            `SELECT * FROM company WHERE email='${email}'`,
            (err, result) => {
              if (err) {
                return res.status(404).json({
                  error: true,
                  message: "Unable to connect.",
                });
              } else {
                if (result.length > 0) {
                  let total_amount = eval(
                    Number(result[0].wallet_amount) + Number(amount)
                  );
                  db.query(
                    "INSERT INTO transactions(`email`, `amount`, `content`, `tracking_id`, `payment_status`)VALUES(?,?,?,?,?)",
                    [email, amount, content, tracking_id, payment_status],
                    (err, result) => {
                      if (err) {
                        return res.status(404).json({
                          error: true,
                          message: "Unable to connect.",
                        });
                      } else {
                        db.query(
                          "UPDATE company SET wallet_amount=? WHERE email=?",
                          [total_amount, email],
                          (err, results) => {
                            if (err) {
                              return res.status(404).json({
                                error: true,
                                message: "Unable to connect.",
                              });
                            } else {
                              return res.status(200).json({
                                error: false,
                                message: "Transaction completed.",
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  return res.status(422).json({
                    error: true,
                    message: "User not found",
                  });
                }
              }
            }
          );
        }
      }
    });
  }
};

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

exports.getcourier = (req, res) => {
  const email = req.email;
  const { driver_email } = req.body;

  db.query(
    `SELECT * FROM drivers WHERE email='${driver_email}'`,
    (err, result) => {
      if (err) {
        return res.status(404).json({
          error: true,
          message: "Unable to connect.",
        });
      } else {
        if (result.length > 0) {
          db.query(
            `SELECT * FROM vehicles WHERE driver_email='${result[0].email}'`,
            (err, results) => {
              if (err) {
                return res.status(404).json({
                  error: true,
                  message: "Unable to connect.",
                });
              } else {
                return res.status(200).json({
                  error: false,
                  message: "Courier Profile",
                  result_data: {
                    courier_profile: result[0],
                    vehicle: results[0],
                  },
                });
              }
            }
          );
        } else {
          return res.status(422).json({
            error: true,
            message: "Profile not found",
          });
        }
      }
    }
  );
};