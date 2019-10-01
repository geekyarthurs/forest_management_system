const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Invalid Email Address"],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be 8 digits."],
    required: true
  },
  fullName: {
    type: String,
    required: true,
    minLength: [5, "Minimum 5 digits."]
  },
  repeatedPassword: {
    type: String,

    validate: {
      validator: function(val) {
        return val === password;
      },
      message: "Password Mismatch."
    }
  }
});

userSchema.pre("save", async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.repeatedPassword = undefined;
  next();
});
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
    console.log("Comparing Password.")
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
