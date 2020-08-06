import express from "express";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users/me", (req, res) => {
  res.end("Hi there!");
});

app.listen(3000, () => {
  console.log(`Server ready on PORT 3000`);
});
