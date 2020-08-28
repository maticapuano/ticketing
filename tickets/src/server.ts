import express from "express";

const app = express();

app.get("/api/tickets", (req, res) => {
  res.json({ message: "Hi there!! service tickets" });
});

app.listen(3000, () => {
  console.log(`Server ready on port 3000`);
});
