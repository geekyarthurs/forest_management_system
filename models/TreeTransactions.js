const mongoose = require("mongoose");

let treeTransaction = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    default: new Date().toDateString()
  },
  quantity: {
    type: Number,
    required: true
  }
});

let TreeTransactions = mongoose.model("Transaction",treeTransaction)

module.exports = TreeTransactions
