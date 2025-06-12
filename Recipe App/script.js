const searchBox = document.querySelector(".searchBox")
const searchBtn = document.querySelector(".searchBtn")
const recipeContainer = document.querySelector(".recipe-container")
const recipeDetailsContent = document.querySelector(".recipe-details-content")
const recipeDetails = document.querySelector(".recipe-details")
const recipeDetailsCloseBtn = document.querySelector(".recipe-close-btn")
const recipeDetailsBackdrop = document.querySelector(".recipe-details-backdrop")
const loadingSpinner = document.querySelector(".loading-spinner")

// Enhanced fetch recipes with better error handling
const fetchRecipes = async (query) => {
  if (!query.trim()) {
    showNotification("Please enter a recipe name", "warning")
    return
  }

  showLoading(true)

  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json()

    showLoading(false)
    recipeContainer.innerHTML = ""

    if (!response.meals) {
      recipeContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No recipes found</h3>
          <p>Try searching for something else</p>
        </div>
      `
      return
    }

    // Create recipe cards
    response.meals.forEach((meal) => {
      createRecipeCard(meal)
    })
  } catch (error) {
    showLoading(false)
    showNotification("Failed to fetch recipes. Please try again.", "error")
    console.error("Error fetching recipes:", error)
  }
}

// Create recipe card with clean styling
const createRecipeCard = (meal) => {
  const recipediv = document.createElement("div")
  recipediv.classList.add("recipe")

  recipediv.innerHTML = `
    <img src="${meal.strMealThumb}" loading="lazy" alt="${meal.strMeal}">
    <div class="recipe-content">
      <h3>${meal.strMeal}</h3>
      <p><i class="fas fa-map-marker-alt"></i> <span>${meal.strArea}</span> Cuisine</p>
      <p><i class="fas fa-tag"></i> Category: <span>${meal.strCategory}</span></p>
      <button class="view-recipe-btn">
        <i class="fas fa-eye"></i> View Recipe
      </button>
    </div>
  `

  const button = recipediv.querySelector(".view-recipe-btn")
  button.addEventListener("click", () => {
    openRecipe(meal)
  })

  recipeContainer.appendChild(recipediv)
}

// Enhanced recipe details modal
const openRecipe = (meal) => {
  const ingredients = Object.keys(meal)
    .filter((key) => key.startsWith("strIngredient") && meal[key])
    .map((key) => meal[key])

  const measurements = Object.keys(meal)
    .filter((key) => key.startsWith("strMeasure") && meal[key])
    .map((key) => meal[key])

  const ingredientsList = ingredients
    .map((ingredient, index) => `<li><i class="fas fa-check"></i> ${measurements[index] || ""} ${ingredient}</li>`)
    .join("")

  recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" loading="lazy" alt="${meal.strMeal}">
    <div class="recipe-meta">
      <p><i class="fas fa-map-marker-alt"></i> <span>${meal.strArea}</span> Cuisine</p>
      <p><i class="fas fa-tag"></i> Category: <span>${meal.strCategory}</span></p>
    </div>
    
    <h3><i class="fas fa-list"></i> Ingredients</h3>
    <ul class="ingredients-list">
      ${ingredientsList}
    </ul>
    
    <h3><i class="fas fa-clipboard-list"></i> Instructions</h3>
    <div class="instructions">
      ${meal.strInstructions
        .split(".")
        .map((step) => (step.trim() ? `<p>${step.trim()}.</p>` : ""))
        .join("")}
    </div>
    
    ${
      meal.strYoutube
        ? `
      <h3><i class="fab fa-youtube"></i> Video Tutorial</h3>
      <div class="video-container">
        <iframe 
          src="${meal.strYoutube.replace("watch?v=", "embed/")}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `
        : ""
    }
  `

  recipeDetails.classList.add("active")
  document.body.style.overflow = "hidden"
}

// Close modal functionality
const closeRecipeDetails = () => {
  recipeDetails.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Loading spinner control
const showLoading = (show) => {
  if (show) {
    loadingSpinner.classList.add("active")
  } else {
    loadingSpinner.classList.remove("active")
  }
}

// Notification system
const showNotification = (message, type = "info") => {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas fa-${type === "error" ? "exclamation-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"}"></i>
    ${message}
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = "0"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Event listeners
searchBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const searchInput = searchBox.value.trim()
  fetchRecipes(searchInput)
})

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
    const searchInput = searchBox.value.trim()
    fetchRecipes(searchInput)
  }
})

recipeDetailsCloseBtn.addEventListener("click", closeRecipeDetails)
recipeDetailsBackdrop.addEventListener("click", closeRecipeDetails)

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && recipeDetails.classList.contains("active")) {
    closeRecipeDetails()
  }
})
