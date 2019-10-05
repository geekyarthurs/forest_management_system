const Trees = require("../models/Tree");
const Member = require("../models/Member");
const Transaction = require("../models/TreeTransactions");
exports.dashboard = async (req, res) => {
  let tree = await Trees.findOne({ year: new Date().getFullYear() })
    .select("quantity soldQuantity soldQuantityA soldQuantityB soldQuantityC")
    .lean();

  if (!tree) {
    tree = {};
    tree.quantity = 0;
    tree.soldQuantityA = 0;
    tree.soldQuantityB = 0;
    tree.soldQuantityC = 0;
  }

  let treeQuantity = tree.quantity;
  let soldQuantityA = tree.soldQuantityA;
  let soldQuantityB = tree.soldQuantityB;
  let soldQuantityC = tree.soldQuantityC;

  let soldQuantity = tree.soldQuantity;
  let leftQuantity = treeQuantity - soldQuantity;

  let transactions = await Transaction.find().lean();
  let earning = 0;
  transactions.forEach(transaction => {
    earning += transaction.price;
  });

  let leftPercentage = (leftQuantity / treeQuantity) * 100;

  res.render("dashboard", {
    transactions,
    soldQuantityA,
    soldQuantityB,
    soldQuantityC,
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
    req.body.quantityC + req.body.quantityB + req.body.quantityA ==
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
  let treeData = await Trees.find()
    .select("-_id -__v")
    .sort("year")
    .lean();

  // const { soldQuantity } = treeThisYear;

  // console.log(treeThisYear);
  let data = await Member.find()
    .select("fullName")
    .lean();
  let year = new Date().getFullYear();

  // console.log(data);

  // console.log(treeThisYear);

  res.render("sell-trees", {
    treeData,
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
      {
        purchasedTrees:
          parseInt(user.purchasedTrees) + parseInt(req.body.quantity)
      },
      {
        purchasedTreesA:
          parseInt(user.purchasedTreesA) + parseInt(req.body.quantity)
      }
    );
  } else if (quality == "B") {
    data = await Member.updateOne(
      { fullName: req.body.customer },
      {
        purchasedTrees:
          parseInt(user.purchasedTrees) * 1 + parseInt(req.body.quantity)
      },
      {
        purchasedTreesB:
          parseInt(user.purchasedTreesB) * 1 + parseInt(req.body.quantity) * 1
      }
    );
  } else {
    data = await Member.updateOne(
      { fullName: req.body.customer },
      {
        purchasedTrees:
          parseInt(user.purchasedTrees) * 1 + parseInt(req.body.quantity) * 1
      },
      {
        purchasedTreesC:
          parseInt(user.purchasedTreesC) * 1 + parseInt(req.body.quantity) * 1
      }
    );
  }
  let transacted = await Transaction.create({
    fullName: req.body.customer,
    price: req.body.price,
    quantity: req.body.quantity,
    quality: req.body.quality
  });
  let leftTrees = InitialTrees.quantity * 1 - InitialTrees.soldQuantity * 1;

  console.log(leftTrees);

  if (quality == "A") {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: InitialTrees.soldQuantity * 1 + req.body.quantity * 1,
        soldQuantityA: InitialTrees.soldQuantityA * 1 + req.body.quantity * 1
      }
    );
  } else if (quality == "B") {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: InitialTrees.soldQuantity * 1 + req.body.quantity * 1,
        soldQuantityB: InitialTrees.soldQuantityB * 1 + req.body.quantity * 1
      }
    );
  } else {
    let treeUpdate = await Trees.updateOne(
      { year: new Date().getFullYear() },
      {
        soldQuantity: InitialTrees.soldQuantity * 1 + req.body.quantity * 1,
        soldQuantityC: InitialTrees.soldQuantityC * 1 + req.body.quantity * 1
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
