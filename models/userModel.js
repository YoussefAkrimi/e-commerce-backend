const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const baseOptions = {
  discriminatorKey: "itemtype", // this is where the model type will be stored
  timestamps: true,
  collection: "UserType",
};

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    token: { type: String },
    code: { type: String }, // code for verification
    verify: { type: Boolean, default: false }, // Track if the email is verified
  },
  baseOptions // apply the discriminator key
);

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

const User = mongoose.model("User", userSchema); // specify users as the collection name
module.exports = User;
