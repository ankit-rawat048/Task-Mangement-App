const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "in progress", "completed"],
      default: "pending"
    },
    deadline: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    subtasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    parentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null
    },
    dependsOn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tags: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Task", taskSchema);
