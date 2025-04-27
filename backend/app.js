const express = require("express");
const cors = require("cors");
const filmController = require("./controllers/filmController");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/film", filmController);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});