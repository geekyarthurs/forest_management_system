const Trees = require("../models/Tree");
const Member = require("../models/Member");
const Transaction = require("../models/TreeTransactions");
exports.dashboard = async (req, res) => {
  let tree = await Trees.findOne({ year: new Date().getFullYear() })
    .select("quantity soldQuantity soldQuantityA soldQuantityB soldQuantityC")
    .lean();

  let treeQuantity = tree.quantity;
  let soldQuantity = tree.soldQuantity;
  let leftQuantity = treeQuantity - soldQuantity;

  let transactions = await Transaction.find()
    .select("price")
    .lean();
  let earning = 0;
  transactions.forEach(transaction => {
    earning += transaction.price;
  });

  let leftPercentage = (leftQuantity / treeQuantity) * 100


  res.render("dashboard", {
    quantity: tree.quantity,
    leftQuantity,
    earning,
    leftPercentage,
    transactionsCount: transactions.length
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
  if (
    req.body.quantityC + req.body.quantityB + req.body.quantityA >
    req.body.quantity
  ) {
    req.flash(
      "error",
      "Total Quantity should be equal to sum of all quantities."
    );
    return res.redirect("/import-forest");
  }

  try {
    let data = req.body;
    data.updatedBy = req.session.user.fullName;

    let updateTree = await Trees.create(req.body);

    console.log(updateTree);
    res.redirect("/forest-record");
  } catch (err) {
    req.flash("error", "Forest Already Exists in the database.");
    res.redirect("/forest-record");
  }
};

exports.importTreesScreen = (req, res) => {
  res.render("import-forest", {
    message: req.flash("message"),
    error: req.flash("error")
  });
};

exports.forestRecord = async (req, res) => {
  let data = await Trees.find()
    .select("-_id -__v")
    .sort("year")
    .lean();

  console.log(data);

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

  // console.log(data);

  console.log(treeThisYear);

  res.render("sell-trees", {
    leftQuantity: treeThisYear.quantity - soldQuantity,
    year,
    data,
    message: req.flash("message")
  });
};

exports.sellForest = async (req, res) => {
  //quantity , price , cusotomer , quality
  console.log(req.body);
  const user = await Member.findOne({ fullName: req.body.customer }).lean();
  const InitialTrees = await Trees.findOne({
    year: new Date().getFullYear()
  }).lean();
  const quality = req.body.quality;
  let data;
  if (quality == "A") {
    data = await Member.updateOne(
      { fullName: req.body.customer },
      { purchasedTrees: user.purchasedTrees + req.body.quantity },
      { purchasedTreesA: user.purchasedTreesA + req.body.quantity }
    );
  } else if (quality == "B") {
    data = await Member.updateOne(
      { fullName: req.body.customer },
      { purchasedTrees: user.purchasedTrees + req.body.quantity },
      { purchasedTreesB: user.purchasedTreesB + req.body.quantity }
    );
  } else {
    data = await Member.updateOne(
      { fullName: req.body.customer },
      { purchasedTrees: user.purchasedTrees + req.body.quantity },
      { purchasedTreesC: user.purchasedTreesC + req.body.quantityC }
    );
  }
  let transacted = await Transaction.create({
    fullName: req.body.customer,
    price: req.body.price,
    quantity: req.body.quantity,
    quality: req.body.quality
  });
  let leftTrees = InitialTrees.quantity - InitialTrees.soldQuantity;

  console.log(leftTrees);

  if (quality == "A") {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: req.body.quantity,
        soldQuantityA: req.body.quantity
      }
    );
  } else if (quality == "B") {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: req.body.quantity,
        soldQuantityB: req.body.quantity
      }
    );
  } else {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: req.body.quantity,
        soldQuantityC: req.body.quantity
      }
    );
  }

  console.log(transacted);
  return res.redirect("/view-transactions");
};

exports.viewTransactions = async (req, res) => {
  let transactions = await Transaction.find()
    .select("-_id -__v")
    .lean();
  console.log(transactions);
  console.log(typeof transactions);
  res.render("transactions", { transactions, message: req.flash("message") });
};
