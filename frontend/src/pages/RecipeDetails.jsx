import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'
import { BsStopwatchFill } from 'react-icons/bs'

export default function RecipeDetails() {
  const recipe = useLoaderData()

  if (!recipe) {
    return (
      <div className="recipe-details-page">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Recipe not found</h3>
          <p>The recipe you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recipe-details-page">
      <div className="recipe-details-header">
        {/* Author info */}
        <div className="recipe-author">
          <img src={profileImg} alt="Author" />
          <div className="recipe-author-info">
            <h5>{recipe.email || "Anonymous Chef"}</h5>
            <span>Recipe Author</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="recipe-detail-title">{recipe.title}</h1>

        {/* Time badge */}
        {recipe.time && (
          <div className="recipe-time-badge">
            <BsStopwatchFill />
            {recipe.time}
          </div>
        )}
      </div>

      {/* Cover image */}
      <div className="recipe-detail-image">
        <img
          src={recipe.coverImage
            ? `http://localhost:5000/images/${recipe.coverImage}`
            : food}
          alt={recipe.title}
        />
      </div>

      {/* Content grid */}
      <div className="recipe-info-grid">
        <div className="recipe-ingredients">
          <h4>🥄 Ingredients</h4>
          <ul>
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-instructions">
          <h4>📝 Instructions</h4>
          <p>{recipe.instructions}</p>
        </div>
      </div>
    </div>
  )
}