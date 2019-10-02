const mongoose = require("mongoose");

const treeSchema = mongoose.Schema({
  year: {
    type: Number,
    default: new Date().getFullYear(),
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  },
  updateTime: {
    type: String,
    default: new Date().toDateString()
  },
  updatedBy: {
    type: String,
    required: true
  },
  soldQuantity: {
    type: Number,
    default: 0
  }
});

let Trees = mongoose.model("Tree", treeSchema);

module.exports = Trees;
