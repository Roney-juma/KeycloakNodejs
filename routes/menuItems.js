const qs =require("qs");
const axios = require("axios");
const express = require("express");
const router =  express.Router();
const jwt = require("jsonwebtoken");


// Middleware
const keycloak = require("#middlewares/keycloak");
const { checkRoles } = require("../middlewares/checkRoles");
const verifyToken = require("../middlewares/verifyToken");

// Fake Data
const menuItems = [
  {
    name: "Croissant",
    price: "$1",
    onMenu: true
  },
  {
    name:"Latte",
    price: "$5",
    onMenu: true
  },
  {
    name: "Roti Canai",
    price: "$0.50",
    onMenu: true
  },
  {
    name: "Hot Chocolate",
    price: "$5",
    onMenu: false
  },
  {
    name: "Satay",
    price: "$8",
    onMenu: false
  },
  {
    name: "Pad Thai",
    price: "$7",
    onMenu: false
  }
];

// Route open to any role
router.get("/menu-items", 
[keycloak.protect('bankingly')],
async ( req, res, next) => {
  try {
    let filtered = menuItems.filter(item => {
      if (item.onMenu === true) {
        return item;
      }
    });

    // Return filtered data
    res.json(filtered);
  } catch (error) {
    return next(error);
  }
});


router.get("/menu-items/all", 
[verifyToken, keycloak.protect(), checkRoles('admin')],
async ( req, res, next) => {
  try {
    // Return all data
    res.json(menuItems);
  } catch (error) {
    return next(error);
  }
});

router.post("/login", (req,res) => {
  const payload= req.body;
  const data = qs.stringify({
      'client_id': process.env.KEYCLOAK_CLIENT,
      'username': payload.userName,
      'password': payload.password,
      'grant_type': process.env.KEYCLOAK_GRANT_TYPE,
      'client_secret': process.env.KEYCLOAK_CLIENT_SECRET
  });
  var config = {
      method: 'post',
      url: process.env.KEYCLOAK_AUTH_URL,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
  };

  axios(config)
      .then((response) => {
          const authResponse = response.data;
          const decoded = jwt.decode(authResponse.access_token);
          const roles = decoded['realm_access']['roles'];
          const username = decoded['preferred_username'];
          const name = decoded['name'];
          const resultData= authResponse.access_token
          return res.json(authResponse)
      })
      .catch((error) => {
          return res.send({
              "authenticated": false,
              "failureReason": error
          })
      });
})

router.post("/logout", (req,res) => {
  const payload= req.body;
  const data = qs.stringify({
      'client_id': process.env.KEYCLOAK_CLIENT,
      'refresh_token': payload.refresh_token,
      'client_secret': process.env.KEYCLOAK_CLIENT_SECRET
  });
  var config = {
      method: 'post',
      url: process.env.KEYCLOAK_LOGOUT_URL,
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
  };

  axios(config)
      .then((response) => {
          const authResponse = response.data;
          return res.json({ message: 'Successfull: You have logged out' })
      })
      .catch((error) => {
          return res.send({
              "Not logged out": false,
              "failureReason": error
          })
      });
})


module.exports = router;