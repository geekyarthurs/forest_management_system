exports.dashboard = (req, res) => {
  res.render("dashboard");
};

exports.error = (req, res) => {
  if (req.session.user) {
    res.render("404");
  } else {
    res.redirect("/login");
  }
};
