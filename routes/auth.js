const express = require("express");

// import auth
const { signup, signin } = require("../middlewares/auth");

// import validator
const {
  signUpValidator,
  signInValidator,
} = require("../middlewares/validators/auth");

// import controller
const { getToken } = require("../controllers/auth");

// make router
const router = express.Router();

// router
router.post("/signup", signUpValidator, signup, getToken);
router.post("/signin", signInValidator, signin, getToken);

// exports
module.exports = router;
