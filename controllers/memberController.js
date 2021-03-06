const Member = require("../models/Member");

exports.create = async (req, res) => {
  console.log(req.file);
  try {
    let user = {
      fullName: req.body.firstName + " " + req.body.lastName,
      contact: req.body.contact,
      location: req.body.location,
      profilePic: "/" + req.file.path.replace("public/", "")
    };
    await Member.create(user);
    req.flash("message", "Succesfully created.");
    return res.redirect("/customers");
  } catch (err) {
    res.send(err);
  }
};

exports.update = async (req, res) => {
  try {
    contact = req.body.contact;
    await Member.findByIdAndUpdate(req.body._id, {
      fullName: req.body.fullName,
      contact: req.body.contact,
      location: req.body.location
    });
    req.flash("message", "Successfully Updated !");
    res.redirect("/customers");
  } catch (err) {
    console.log(err);
    res.render("404");
  }
};

exports.updatePage = async (req, res) => {
  try {
    contact = req.query.contact * 1;
    const mem = await Member.findOne({ contact });
    console.log(mem);
    const user = {
      id: mem._id,
      fullName: mem.fullName,
      contact: mem.contact,
      location: mem.location
    };
    res.render("update", { user });
  } catch (err) {
    console.log(err);
    res.render("404");
  }
};

exports.delete = async (req, res) => {
  try {
    contact = req.query.contact;
    await Member.deleteOne({ contact });
    req.flash("message", "Succesfully deleted.");
    res.redirect("/customers");
  } catch (err) {
    res.render("404");
  }
};

exports.createPage = async (req, res) => {
  res.render("create");
};

exports.viewAllMembers = async (req, res) => {
  let customers = await Member.find()
    .select("-__v -_id")
    .lean();

  // console.log(customers);
  // let customersList = customers.lean()
  //   console.log(customers)

  if (customers.length == 0) {
    return res.render("tables", {
      message: req.flash("message"),
      customers: []
    });
  }

  res.render("tables", {
    message: req.flash("message"),
    customers
  });
};
