const express = require("express");
const { getRecipes, getRecipe,addRecipe,editRecipe,deleteRecipe } = require("../controller/recipe");
const router = express.Router();

router.get("/", (getRecipes));  // To get all the recipes

router.get("/:id",getRecipe) // To get a specific recipe by ID

router.post("/", addRecipe) // To create a new recipe

router.put("/:id", editRecipe) // To update an existing recipe by ID

router.delete("/:id", deleteRecipe) // To delete a recipe by ID 

module.exports = router;