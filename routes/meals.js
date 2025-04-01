const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const express = require('express');
const router = express.Router();
const Meal = require('../models/Meal');

// Get all meals
router.get('/', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single meal
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload a meal with image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, price, rating } = req.body;
    const image = "/uploads/" + req.file.filename;

    const meal = new Meal({
      name,
      price,
      rating,
      image,
      available: true
    });

    await meal.save();
    res.json({ success: true, meal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a meal
router.put('/:id', async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a meal
router.delete('/:id', async (req, res) => {
  try {
    const result = await Meal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
