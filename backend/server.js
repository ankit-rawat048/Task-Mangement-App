const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const allDataRoute = require("./routes/allDataRoute");

dotenv.config();
connectDB();

const app = express();

// Allow both local dev and Vercel frontend
const allowedOrigins = [
  "http://localhost:3000", // local development
  "https://task-mangement-app-orpin.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Test route for Render root URL
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Main API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", userRoutes);
app.use("/api", allDataRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
