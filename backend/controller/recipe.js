const Recipe = require("../models/recipe");

const getRecipes = async (req, res) => {
  const recipes = await Recipe.find();
  return res.json(recipes);
};

const getRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  return res.json(recipe);
};

const addRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.json({ message: "Required fields cannot be empty" });
  }

  const newRecipe = await Recipe.create({
    title,
    ingredients,
    instructions,
    time
  });

  return res.json(newRecipe);
};

const editRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe" });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe };