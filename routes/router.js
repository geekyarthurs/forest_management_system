const express = require("express");
const authController = require("./../controllers/authController");
const webController = require("./../controllers/webController");
const memberController = require("./../controllers/memberController");
const router = express.Router();

router
  .route("/login")
  .get(authController.loginPage)
  .post(authController.login);

router
  .route("/signup")
  .get(authController.signupPage)
  .post(authController.signup);

router.get("/logout", authController.logout);

router.get("/", authController.checkIfLoggedIn, webController.dashboard);

router
  .route("/create-customer")
  .get(authController.checkIfLoggedIn, memberController.createPage)
  .post(authController.checkIfLoggedIn, memberController.create);

router
  .route("/customers")
  .get( memberController.viewAllMembers);

router
  .route("/update-customer")
  .get(memberController.updatePage)
  .post(memberController.update);

router.route("/delete-customer")
.get(memberController.delete)
router.get("*", webController.error);

module.exports = router;
