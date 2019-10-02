const Trees = require("../models/Tree");
const Member = require("../models/Member");
const Transaction = require("../models/TreeTransactions");
exports.dashboard = async (req, res) => {
  let tree = await Trees.findOne({ year: new Date().getFullYear() })
    .select("quantity")
    .lean();

  let totalPriceArr = await Transaction.find()
    .select("price quantity")
    .lean();

  let totalEarning = 0;
  let soldQuantity = 0;

  if (!tree || !totalPriceArr) {
    return res.render("dashboard", {
      quantity: "Not added.",
      earning: "No earnings.",
      leftPercentage: "Unavailable",
      transactionsCount: "No transactions yet."
    });
  }

  totalPriceArr.forEach(x => {
    totalEarning += x.price;
    soldQuantity += x.quantity;
  });

  let leftPercentage = parseInt(
    ((tree.quantity - soldQuantity) / tree.quantity) * 100
  );

  console.log(leftPercentage);

  console.log(tree.quantity);
  console.log(totalEarning);

  res.render("dashboard", {
    quantity: tree.quantity,
    earning: totalEarning,
    leftPercentage,
    transactionsCount: totalPriceArr.length
  });
};

exports.error = (req, res) => {
  if (req.session.user) {
    res.render("404");
  } else {
    res.redirect("/login");
  }
};

exports.importTrees = async (req, res) => {
  try {
    let data = req.body;
    data.updatedBy = req.session.user.fullName;

    let updateTree = await Trees.create(req.body);

    console.log(updateTree);
    res.render("imported-forests", { message: req.flash("message") });
  } catch (err) {
    req.flash("message", "Forest Already Exists in the database.");
    res.redirect("/import-forest");
  }
};

exports.importTreesScreen = (req, res) => {
  res.render("import-forest", { message: req.flash("message") });
};

exports.forestRecord = async (req, res) => {
  let data = await Trees.find()
    .select("-_id -__v -soldQuantity")
    .sort("year")
    .lean();

  res.render("imported-forests", { data, message: req.flash("message") });
};

exports.sellForestScreen = async (req, res) => {
  let treeThisYear = await Trees.findOne({ year: new Date().getFullYear() });
  const { soldQuantity } = treeThisYear;

  console.log(treeThisYear);
  let data = await Member.find()
    .select("fullName")
    .lean();
  let year = new Date().getFullYear();

  console.log(data);

  res.render("sell-trees", {
    leftQuantity: treeThisYear.quantity - soldQuantity,
    year,
    data,
    message: req.flash("message")
  });
};

exports.sellForest = async (req, res) => {
  //quantity , price , cusotomer
  console.log(req.body);
  let data = await Member.updateOne(
    { fullName: req.body.customer },
    { purchasedTrees: req.body.quantity }
  );
  let transacted = await Transaction.create({
    fullName: req.body.customer,
    price: req.body.price,
    quantity: req.body.quantity
  });

  console.log(transacted);
  return res.redirect("/view-transactions")
};

exports.viewTransactions = async (req, res) => {
  let transactions = await Transaction.find()
    .select("-_id -__v")
    .lean();
  console.log(transactions);
  console.log(typeof transactions);
  res.render("transactions", { transactions, message: req.flash("message") });
};
