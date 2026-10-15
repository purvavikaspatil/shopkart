const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },

    lastName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phoneNumber: {
      type: Number,
      required: true,
      unique: true
    },

    avatar: {
      type: String
    },

    dob: {
      type: String
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);