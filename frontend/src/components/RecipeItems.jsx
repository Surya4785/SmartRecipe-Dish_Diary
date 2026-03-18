import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs"
import { FaHeart, FaArrowRight } from "react-icons/fa6"
import { FaEdit, FaSearch } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import axios from 'axios'

// Generate a unique gradient based on recipe title string
const getCardGradient = (title = '') => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(135deg, #f5576c 0%, #ff9a76 100%)',
    'linear-gradient(135deg, #6991c7 0%, #a3bded 100%)',
    'linear-gradient(135deg, #13547a 0%, #80d0c7 100%)',
    'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
  ]
  // Simple hash from title to pick a unique gradient
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

// Generate food emoji based on title
const getFoodEmoji = (title = '') => {
  const emojis = ['🍲', '🥘', '🍳', '🥗', '🍕', '🌮', '🍜', '🥙', '🍛', '🥞', '🍱', '🧆']
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  return emojis[Math.abs(hash) % emojis.length]
}

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  let path = window.location.pathname === "/myRecipe" ? true : false
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setAllRecipes(recipes || [])
  }, [recipes])

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:5000/recipe/${id}`)
      .then((res) => console.log(res))
    setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
    let filterItem = favItems.filter(recipe => recipe._id !== id)
    localStorage.setItem("fav", JSON.stringify(filterItem))
  }

  const favRecipe = (item) => {
    let filterItem = favItems.filter(recipe => recipe._id !== item._id)
    favItems = favItems.filter(recipe => recipe._id === item._id).length === 0
      ? [...favItems, item]
      : filterItem
    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(pre => !pre)
  }

  // Filter recipes based on search term
  const filteredRecipes = allRecipes.filter(item =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Track unique cover images to detect duplicates
  const imageCounts = {}
  allRecipes.forEach(item => {
    const key = item.coverImage || 'default'
    imageCounts[key] = (imageCounts[key] || 0) + 1
  })

  return (
    <>
      {/* Search Bar */}
      {allRecipes.length > 0 && (
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              id="recipe-search"
            />
            {searchTerm && (
              <button
                className="search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="recipe-count">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!allRecipes || allRecipes.length === 0) && (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <h3>No recipes yet</h3>
          <p>Be the first to share a delicious recipe with the community!</p>
        </div>
      )}

      {/* No search results */}
      {allRecipes.length > 0 && filteredRecipes.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No matches found</h3>
          <p>Try a different search term</p>
        </div>
      )}

      {/* Recipe Cards Grid */}
      <div className="card-container">
        {filteredRecipes.map((item, index) => {
          // Use gradient placeholder if cover image is missing or shared by multiple recipes
          const imageKey = item.coverImage || 'default'
          const isDuplicateImage = imageCounts[imageKey] > 1
          const showGradient = !item.coverImage || isDuplicateImage

          return (
            <div
              key={item._id || index}
              className="recipe-card"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => navigate(`/recipe/${item._id}`)}
            >
              <div className="card-image-wrapper">
                {showGradient ? (
                  <div
                    className="card-gradient-placeholder"
                    style={{ background: getCardGradient(item.title) }}
                  >
                    <span className="gradient-emoji">{getFoodEmoji(item.title)}</span>
                    <span className="gradient-title">{item.title?.charAt(0)?.toUpperCase()}</span>
                  </div>
                ) : (
                  <img
                    src={`http://localhost:5000/images/${item.coverImage}`}
                    alt={item.title}
                    onError={(e) => {
                      // If the image fails to load, replace with gradient
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div class="card-gradient-placeholder" style="background: ${getCardGradient(item.title)}">
                          <span class="gradient-emoji">${getFoodEmoji(item.title)}</span>
                        </div>
                      `
                    }}
                  />
                )}
                <div className="card-image-overlay" />
                {item.time && (
                  <div className="card-time-badge">
                    <BsStopwatchFill />
                    {item.time}
                  </div>
                )}
              </div>

              <div className="card-body">
                <div className="card-title">{item.title}</div>
                <div className="card-actions">
                  {!path ? (
                    <div className="card-action-row">
                      <button
                        className={`fav-btn ${favItems.some(res => res._id === item._id) ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); favRecipe(item); }}
                        aria-label="Toggle favourite"
                      >
                        <FaHeart />
                      </button>
                      <button
                        className="view-btn"
                        onClick={(e) => { e.stopPropagation(); navigate(`/recipe/${item._id}`); }}
                        aria-label="View recipe"
                      >
                        View <FaArrowRight />
                      </button>
                    </div>
                  ) : (
                    <div className="card-edit-actions">
                      <Link
                        to={`/editRecipe/${item._id}`}
                        className="edit-btn"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Edit recipe"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        className="delete-btn"
                        onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
                        aria-label="Delete recipe"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}