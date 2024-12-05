const express = require("express");
const connectDb = require("../db/mongodb.js");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const productRouter = require("../routes/productRoute");
const emailRouter = require("../routes/emailSubscription");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/users");

const app = express();

// Middleware to ensure DB is connected before handling any request
const ensureDbConnection = async (req, res, next) => {
  try {
    if (!global.mongoose.conn) {
      await connectDb();  // Ensure DB connection
    }
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Database connection error" });
  }
};

app.use(ensureDbConnection);

app.use(express.static("./public"));

// Security and sanitization middlewares
app.use(mongoSanitize());
app.use(xss());
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/v1/", productRouter);
app.use("/api/v1/email", emailRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Trust the proxy for X-Forwarded-For headers
app.set('trust proxy', 1);  // 1 means trusting the first proxy

const rateLimiter = rateLimit({
  windowMS: 15 * 60 * 1000,
  max: 100,
});
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.status(200).json("Working on root");
});

const PORT = process.env.PORT || 7000;
const startup = async () => {
  try {
    await connectDb();
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startup();

module.exports = app;