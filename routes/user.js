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

const {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

// import controller
const { getToken } = require("../controllers/auth");

// make router
const router = express.Router();

// router
router.post("/signup", signUpValidator, signup);
router.post("/signin", signInValidator, signin, getToken);
router.get("/", admin, getAllUsers);
router.get("/:id", adminOrUser, getOneUser);
router.put("/:id", adminOrUser, updateUser);
router.delete("/:id", adminOrUser, deleteUser);

// exports
module.exports = router;
