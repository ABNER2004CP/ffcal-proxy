import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// مسیر API
app.use("/api", express.static("api"));

// تست
app.get("/", (req, res) => {
  res.send("FF Calendar Proxy is running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
