const express = require("express");
const authController = require("./../controllers/authController");
const webController = require("./../controllers/webController");
const memberController = require("./../controllers/memberController");
const router = express.Router();

var multer = require("multer");
var path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({ storage: storage });

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
  .post(
    authController.checkIfLoggedIn,
    upload.single("profilePic"),
    memberController.create
  );

router.route("/customers").get(memberController.viewAllMembers);

router
  .route("/update-customer")
  .get(memberController.updatePage)
  .post(memberController.update);

router.route("/delete-customer").get(memberController.delete);

router
  .route("/import-forest")
  .get(webController.importTreesScreen)
  .post(webController.importTrees);

router.get("/forest-record", webController.forestRecord);

router.get("/sell-forest", webController.sellForestScreen);
router.post("/sell-forest", webController.sellForest);

router.get("/view-transactions", webController.viewTransactions);

router.get("*", webController.error);

module.exports = router;
