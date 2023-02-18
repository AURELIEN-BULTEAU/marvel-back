require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());

const userRoutes = require("./routes/user");
// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

app.use(userRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur notre serveur Marvel");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    let filters = "";
    if (req.query.name) {
      filters = filters + "&name=" + req.query.name;
    }

    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=" +
        process.env.MARVEL_API_KEY +
        filters
    );
    res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/related-comics", async (req, res) => {
  try {
    console.log(req.query);
    const response = await axios.get(
      `https://lereacteur-marvel-api.herokuapp.com/character/${req.query.characterID}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      "https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=" +
        process.env.MARVEL_API_KEY
    );
    res.status(200).json(response.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
app.all("*", (req, res) => {
  res.status(400).json({ message: "Page not found" });
  const PORT = process.env.PORT;
});
app.listen(process.env.PORT, () => {
  console.log(`Serveur started on port ${PORT}`);
});
