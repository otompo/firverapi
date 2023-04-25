// import { readdirSync } from "fs";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
// routes imports
import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import gigRoute from "./routes/gig.route.js";
import ReviewsRoute from "./routes/reviews.route.js";
import orderRoute from "./routes/order.route.js";
import messageRoute from "./routes/message.route.js";
import conversationRoute from "./routes/conversation.route.js";
import Gig from "./models/gig.model.js";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("*****DATABASE IS READY");
  } catch (error) {
    console.log(error);
  }
};

// middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/gigs", async (req, res, next) => {
  const q = req.query;
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
  };
  try {
    const gigs = await Gig.find(filters).sort({ [q.sort]: -1 });
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
});
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", ReviewsRoute);
// auto load routes
// readdirSync("./routes").map((r) => app.use("/api", "./routes/${r}"));

app.get("/", (req, res) => {
  res.send(`<h1>FIVERR SERVER</h1>`);
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  connect();
  console.log("Backend server is running");
});
