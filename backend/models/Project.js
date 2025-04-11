const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: {
    type: String,
    default: ""
  },
  dueDate: {
    type: Date,
    default: null
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }]
});

module.exports = mongoose.model("Project", projectSchema);
