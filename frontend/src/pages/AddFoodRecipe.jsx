import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onHandleChange = (e) => {
    let val
    if (e.target.name === 'ingredients') {
      val = e.target.value.split(',')
    } else if (e.target.name === 'file') {
      val = e.target.files[0]
      setFileName(e.target.files[0]?.name || '')
    } else {
      val = e.target.value
    }
    setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post("http://localhost:5000/recipe", recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      navigate("/")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recipe-form-page">
      <div className="recipe-form-card">
        <div className="recipe-form-header">
          <h2>🍳 Add New Recipe</h2>
          <p>Share your culinary masterpiece with the world</p>
        </div>

        <form className="recipe-form" onSubmit={onHandleSubmit}>
          <div className="form-group">
            <label htmlFor="recipe-title">Recipe Title</label>
            <input
              id="recipe-title"
              type="text"
              className="form-input"
              name="title"
              placeholder="e.g. Creamy Garlic Pasta"
              onChange={onHandleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipe-time">Cooking Time</label>
            <input
              id="recipe-time"
              type="text"
              className="form-input"
              name="time"
              placeholder="e.g. 30 minutes"
              onChange={onHandleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipe-ingredients">Ingredients</label>
            <textarea
              id="recipe-ingredients"
              className="form-textarea"
              name="ingredients"
              rows="4"
              placeholder="Separate ingredients with commas (e.g. pasta, garlic, cream, parmesan)"
              onChange={onHandleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="recipe-instructions">Instructions</label>
            <textarea
              id="recipe-instructions"
              className="form-textarea"
              name="instructions"
              rows="5"
              placeholder="Step-by-step cooking instructions..."
              onChange={onHandleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Recipe Image</label>
            <div className="file-upload-area">
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                <span>Click to upload</span> or drag and drop
              </div>
              <input
                type="file"
                name="file"
                accept="image/*"
                onChange={onHandleChange}
              />
            </div>
            {fileName && <div className="file-name">📎 {fileName}</div>}
          </div>

          <button type="submit" className="recipe-submit-btn" disabled={loading}>
            {loading ? "Adding Recipe..." : "🚀 Add Recipe"}
          </button>
        </form>
      </div>
    </div>
  )
}