const mongoose = require("mongoose");
const validator = require("validator");

let memberSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true,
    length: [10, "Invalid Contact Number"]
  },
  location: {
    type: String,
    required: true,
    maxLength: [20, "Invalid Location"]
  },
  purchasedTrees: {
    type: Number,
    default: 0
  },
  purchasedTreesA: {
    type: Number,
    default: 0
  },
  purchasedTreesB: {
    type: Number,
    default: 0
  },
  purchasedTreesC: {
    type: Number,
    default: 0
  },

  profilePic: {
    type: String,
    required: true
  }
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
