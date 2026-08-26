require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./Routes/adminRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Admin Routes
// Option A: Use '/admin'  → frontend should call http://localhost:5000/admin/login
// Option B: Use '/api/admin'  → frontend should call http://localhost:5000/api/admin/login
app.use("/api/admin", adminRoutes); // 👈 pick one prefix and stay consistent

// ✅ Default Route (optional)
app.get("/", (req, res) => res.send("Server is running..."));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
