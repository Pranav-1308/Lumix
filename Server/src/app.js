import cors from "cors";
import express from "express";
import router from "./routes/index.js";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://mama-sycamore-delighted.ngrok-free.dev",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }

    },
    credentials: true,
  })
);

app.use((req, res, next) => {

  req.io = app.get("io");

  next();

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/v1", router);

export default app;