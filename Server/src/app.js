import cors from "cors";
import express from "express";
import router from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/v1", router);

export default app;