const express = require("express");

// import auth
const { signup, signin } = require("../middlewares/auth/user");

// admin or user validator
const { admin, user, adminOrUser } = require("../middlewares/auth/user");
const { getMe } = require("../controllers/auth");
const { userValidator } = require("../middlewares/validators/user");

// import validator
const {
  signUpValidator,
  signInValidator,
} = require("../middlewares/validators/auth");

const { updateUser } = require("../controllers/user");

// import controller
const { getToken } = require("../controllers/auth");

// make router
const router = express.Router();

// router
router.post("/signup", signUpValidator, signup, getToken);
router.post("/signin", signInValidator, signin, getToken);
router.get("/getMe", adminOrUser, getMe);
router.put("/edit", adminOrUser, userValidator, updateUser);

// exports
module.exports = router;
