const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(201).json({
        status: "error",
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({ email });
    console.log(user);

    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      console.log("Triggered.");
      req.flash("loginErrors", "Invalid ID or Password.");
      return res.redirect("/");
    }
    req.session.user = { email: user.email, fullName: user.fullName };
    req.session.save(() => {
      console.log(res.locals.fullName)
      console.log(req.session.user)
      console.log("Triggered valid.");
      return res.redirect("/");
    });
  } catch (err) {
    req.flash("loginErrors", "Invalid ID or Password.");
      return res.redirect("/");

  }
  //Check if email and password exists
};
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
exports.loginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    res.render("login", {
      loginErrors: req.flash("loginErrors"),
      success: req.flash("success")
    });
  }
};

exports.checkIfLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/login");
  }
};

exports.signupPage = (req, res) => {
  res.render("register", {
    errors: req.flash("errors")
  });
};

exports.signup = async (req, res) => {
  try {
    let user = await User.create({
      fullName: req.body.firstName + " " + req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      repeatPassword: req.body.repeatedPassword
    });

    req.flash("success", "Succesfully registered.");
    res.redirect("/login");
  } catch (err) {
    req.flash("errors", "Failed to register.");
    res.redirect("/signup");
  }
};
