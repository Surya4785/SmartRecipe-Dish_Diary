import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    time: ''
  })
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/recipe/${id}`)
        const res = response.data
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients.join(","),
          instructions: res.instructions,
          time: res.time
        })
      } catch (err) {
        console.error(err)
      }
    }
    getData()
  }, [id])

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
      await axios.put(`http://localhost:5000/recipe/${id}`, recipeData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      navigate("/myRecipe")
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
          <h2>✏️ Edit Recipe</h2>
          <p>Update your recipe details below</p>
        </div>

        <form className="recipe-form" onSubmit={onHandleSubmit}>
          <div className="form-group">
            <label htmlFor="edit-title">Recipe Title</label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              name="title"
              placeholder="e.g. Creamy Garlic Pasta"
              onChange={onHandleChange}
              value={recipeData.title}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-time">Cooking Time</label>
            <input
              id="edit-time"
              type="text"
              className="form-input"
              name="time"
              placeholder="e.g. 30 minutes"
              onChange={onHandleChange}
              value={recipeData.time}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-ingredients">Ingredients</label>
            <textarea
              id="edit-ingredients"
              className="form-textarea"
              name="ingredients"
              rows="4"
              placeholder="Separate ingredients with commas"
              onChange={onHandleChange}
              value={recipeData.ingredients}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-instructions">Instructions</label>
            <textarea
              id="edit-instructions"
              className="form-textarea"
              name="instructions"
              rows="5"
              placeholder="Step-by-step cooking instructions..."
              onChange={onHandleChange}
              value={recipeData.instructions}
              required
            />
          </div>

          <div className="form-group">
            <label>Recipe Image</label>
            <div className="file-upload-area">
              <div className="upload-icon">📸</div>
              <div className="upload-text">
                <span>Click to upload</span> a new image (optional)
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
            {loading ? "Updating Recipe..." : "✨ Update Recipe"}
          </button>
        </form>
      </div>
    </div>
  )
}