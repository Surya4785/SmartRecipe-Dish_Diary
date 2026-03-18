import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import RecipeDetails from "./pages/RecipeDetails";

const API = "http://localhost:5000";

// GET ALL RECIPES
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${API}/recipe`);
    return res.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

// GET MY RECIPES
const getMyRecipes = async () => {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    let allRecipes = await getAllRecipes();

    if (!user) return [];

    return allRecipes.filter((item) => item.createdBy === user._id);
  } catch (error) {
    console.error("Error loading my recipes:", error);
    return [];
  }
};

// GET FAVORITE RECIPES
const getFavRecipes = () => {
  try {
    const fav = JSON.parse(localStorage.getItem("fav"));
    return fav ? fav : [];
  } catch (error) {
    console.error("Error loading favorite recipes:", error);
    return [];
  }
};

// GET SINGLE RECIPE
const getRecipe = async ({ params }) => {
  try {
    let recipe;

    const res = await axios.get(`${API}/recipe/${params.id}`);
    recipe = res.data;

    if (recipe.createdBy) {
      const userRes = await axios.get(`${API}/user/${recipe.createdBy}`);
      recipe = { ...recipe, email: userRes.data.email };
    }

    return recipe;
  } catch (error) {
    console.error("Error loading recipe:", error);
    return null;
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}