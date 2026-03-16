# 🍲 SmartRecipe - Dish Diary

A full-stack **Recipe Management Web Application** where users can add, view, update, and delete cooking recipes.  
Users can store recipe details such as **title, ingredients, instructions, and cooking time**.

Built using **React, Node.js, Express, and MongoDB**.

---

## 🚀 Features

- ➕ Add new recipes  
- 📖 View all recipes  
- 🔍 View single recipe details  
- ✏️ Update recipes  
- 🗑️ Delete recipes  
- 💾 Store recipes in MongoDB  
- ⚡ Fast frontend with React

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- React Router
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

---

## 📂 Project Structure

```
SmartRecipe-Dish_Diary
│
├── backend
│   ├── models
│   │   └── recipe.js
│   ├── routes
│   │   └── recipeRoutes.js
│   ├── controllers
│   │   └── recipeController.js
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Surya4785/SmartRecipe-Dish_Diary.git
```

### 2. Navigate to the Project

```bash
cd SmartRecipe-Dish_Diary
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:5000
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🗄️ MongoDB Setup

Make sure MongoDB is running locally.

Connection example:

```
mongodb://localhost:27017/recipes
```

You can also use **MongoDB Compass** to view the database.

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|------|------|------|
| GET | /recipes | Get all recipes |
| GET | /recipes/:id | Get a recipe by ID |
| POST | /recipes | Add a new recipe |
| PUT | /recipes/:id | Update a recipe |
| DELETE | /recipes/:id | Delete a recipe |

---

## 🧪 Example Recipe Data

```json
{
  "title": "Veg Sandwich",
  "ingredients": "Bread, Tomato, Butter",
  "instructions": "Spread butter on bread, add tomato slices and grill.",
  "time": "10 minutes"
}
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a new branch  
3. Commit your changes  
4. Push to your branch  
5. Open a Pull Request  

---

## 📜 License

This project is open source and available under the **MIT License**.

---

## 👨‍💻 Author

**Surya Prakash Yadav**

GitHub:  
https://github.com/Surya4785