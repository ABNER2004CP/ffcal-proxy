import express from "express";
import calendarRoute from "./api/calendar.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/calendar", calendarRoute);

app.get("/", (req, res) => {
  res.send("FF Calendar Proxy is running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
// force redeploy
