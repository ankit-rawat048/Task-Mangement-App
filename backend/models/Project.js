const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    createdate: {
      type: Date,
      default: Date.now // auto-create if not provided
    },
    dueDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Project", projectSchema);
