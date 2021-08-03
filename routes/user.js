const express = require("express");

// import auth
const { signup, signin } = require("../middlewares/auth/user");

// admin or user validator
const { admin, user, adminOrUser } = require("../middlewares/auth/user");

// import validator
const {
  signUpValidator,
  signInValidator,
} = require("../middlewares/validators/auth");

const { getMe, updateUser } = require("../controllers/user");

// import controller
const { getToken } = require("../controllers/auth");

// make router
const router = express.Router();

// router
router.post("/signup", signUpValidator, signup, getToken);
router.post("/signin", signInValidator, signin, getToken);
router.get("/:id", user, getMe);
router.put("/:id", user, updateUser);

// exports
module.exports = router;
