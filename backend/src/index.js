require("dotenv").config();
const routes = require("./routes");
const express = require("express");
const cors = require("cors");
const { successResponse } = require("./utils");

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Root API
app.get("/", (req, res) => {
  successResponse(res, {}, "Welcome to Xipper Practical!", 200);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
