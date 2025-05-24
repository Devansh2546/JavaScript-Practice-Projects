// admin info

const admin_username = "admin";
const admin_password = "admin123";

let books = [
  // Initial list of books available in the store
  {
    id: 1,
    name: "Atomic Habits",
    price: 20,
    description: "A guide to building good habits.",
  },
  {
    id: 2,
    name: "The Alchemist",
    price: 15,
    description: "A novel about dreams and destiny.",
  },
  {
    id: 3,
    name: "Clean Code",
    price: 30,
    description: "A handbook of agile software craftsmanship.",
  },
];

let cart = []; // Cart to store selected books
let isloggedIn = false; // Flag to check if user is logged in

// elements

const tabs = document.querySelectorAll(".tab"); // All tab elements
const tabContents = document.querySelectorAll(".tab-content"); // All tab content containers
const bookListEl = document.getElementById("book-list"); // Container element to show book list
const searchInput = document.getElementById("search-input"); // Search input box element
const addBookForm = document.getElementById("add-book-form"); // Form element for adding books
const cartItemsEl = document.getElementById("cart-items"); // Container to show cart items
const totalPriceEl = document.getElementById("total-price"); // Element to display total cart price
const adminPanelEl = document.getElementById("admin-panel"); // Admin panel container element
const loginFormEl = document.getElementById("login-form"); // Admin login form element
const logoutBtn = document.getElementById("logout-btn"); // Logout button element
const cartCountBadge = document.getElementById("cart-count-badge"); // Badge showing total cart item count

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active")); // Remove 'active' class from all tabs
    tab.classList.add("active");
    // console.log(tab);  // to check which tab is clicked

    const selected = tab.getAttribute("data-tab"); // Get the data-tab attribute of the clicked tab
    tabContents.forEach((content) => {
      content.style.display = content.id === selected ? "block" : "none"; // Show the corresponding tab content
    });
    if (selected === "store") {
      searchInput.value = ""; // Clear search input when cart tab is selected
    }
  });
});

// function to render book list with filter string

function renderBooks(filter = "") {
  bookListEl.innerHTML = ""; // Clear the book list container

  //filter books by name or descruption matching the filter
  const filteredBooks = books.filter(
    (book) =>
      book.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
      book.description.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
  );

  if (filteredBooks.length === 0) {
    bookListEl.innerHTML = "<p>No books found.</p>"; // Show message if no books match the filter
    return;
  }

  //for each filtered book ,create its html representation

  filteredBooks.forEach((book) => {
    const quantityIncart = cart[book.id]?.quantity || 0; // Get the quantity of the book in the cart
    const bookEl = document.createElement("div"); // Create a new div for the book
    bookEl.classList.add("book"); // Add 'book' class to the div

    bookEl.innerHTML = `
      <div class="book-info">
        <div class="book-name">${book.name}</div>
        <div class="book-desc">${book.description}</div>
        <div class="book-price">$${book.price.toFixed(2)}</div>
      </div>
      <div class="counter-container">
        ${
          quantityIncart === 0
            ? `<button class="add-to-cart-btn" data-id="${book.id}">Add to Cart</button>` // Show Add button if quantity is 0
            : `<button class="btn-decrement" data-id="${book.id}">-</button>              
               <span class="quantity-value">${quantityIncart}</span>                    
               <button class="btn-increment" data-id="${book.id}">+</button>`
        }
      </div>
    `;
    bookListEl.appendChild(bookEl); // Append the book element to the book list container
  });

  // adding event listener for newly created add to cart button

  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get the book ID from the button
      cart[id] = { ...books.find((b) => b.id === id), quantity: 1 }; // Add the book to the cart with quantity 1
      renderBooks(filter); // Re-render the book list
      renderCart(); // Re-render the cart
    });
  });

  // adding event listener for increment button (+)

  document.querySelectorAll(".btn-increment").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get the book ID from the button
      if (cart[id]) {
        cart[id].quantity++; // Increment the quantity of the book in the cart
        renderBooks(filter); // Re-render the book list
        renderCart(); // Re-render the cart
      }
    });
  });

  // adding event listener for decrement button (-)

  document.querySelectorAll(".btn-decrement").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-id")); // Get the book ID from the button
      if (cart[id]) {
        cart[id].quantity--; // Decrement the quantity of the book in the cart
        if (cart[id].quantity === 0) {
          delete cart[id]; // Remove the book from the cart if quantity is 0
        }
        renderBooks(filter); // Re-render the book list
        renderCart(); // Re-render the cart
      }
    });
  });
}

// function to add book to cart or increase quantity if it already exists

function addToCart(bookId) {
  if (cart[bookId]) {
    cart[bookId].quantity++; // Increase quantity if book already exists in cart
  } else {
    const book = books.find((b) => b.id === bookId); // Find the book by ID
    if (book) {
      cart[bookId] = { ...book, quantity: 1 }; // Add book to cart with quantity 1
    }
  }
  renderCart(); // Re-render the cart
}

function renderCart() {
  cartItemsEl.innerHTML = ""; // Clear the cart items container
  const cartEntries = Object.values(cart); // Get all cart items as an array
  if (cartEntries.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>"; // Show message if cart is empty
    totalPriceEl.textContent = "$0.00"; // Reset total price
    cartCountBadge.textContent = "0"; // Reset cart count badge
    return;
  }
  let total = 0; // Initialize total price
  let totalItems = 0; // Initialize total items count

  cartEntries.forEach((item) => {
    total += item.price * item.quantity; // Calculate total price
    totalItems += item.quantity; // Calculate total items count

    const cartItemEl = document.createElement("div"); // Create a new div for the cart item
    cartItemEl.classList.add("cart-item"); // Add 'cart-item' class to the div

    cartItemEl.innerHTML = `<span class="cart-item-name">${item.name} x${
      item.quantity
    }</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;

    cartItemsEl.appendChild(cartItemEl); // Append the cart item element to the cart items container
  });

  totalPriceEl.textContent = `$${total.toFixed(2)}`; // Update total price display
  cartCountBadge.textContent = totalItems; // Update cart count badge
  cartCountBadge.style.display = "flex"; // Show cart count badge
}

// Function to handle admin login

addBookForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission
  if (!isAdminLoggedIn) {
    alert("Please login as admin to add books.");
    return;
  }

  const name = document.getElementById("book-name").value.trim(); // Get book name from input
  const price = parseFloat(document.getElementById("book-price").value.trim()); // Get book price from input
  const description = document.getElementById("book-desc").value.trim(); // Get book description from input

  if (!name || isNaN(price) || !description) {
    alert("please enter valid book details.");
    return; // Validate input fields
  }
  const newBook = {
    id: books.length + 1, // Generate new book ID
    name,
    price,
    description,
  };

  books.push(newBook); // Add new book to the books array
  renderBooks(searchInput.value); // Re-render the book list
  addBookForm.reset(); // Reset the form fields
  alert("Book added successfully!"); // Show success message
});

// search filter input event  :re-render book list on input chnage
searchInput.addEventListener("input", (e) => {
  renderBooks(searchInput.value); // Re-render book list based on search input
});


// admin logi form submission 
loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value.trim(); // Get username from input
    const password = document.getElementById("password").value.trim(); // Get password from input

    if (username === admin_username && password === admin_password) {
      isAdminLoggedIn = true; // Set admin login flag to true
      alert("Login successful!"); // Show success message
      loginFormEl.style.display = "none"; // Hide login form
      adminPanelEl.style.display = "block"; // Show admin panel
      renderBooks(); // Re-render book list
      loginFormEl.reset(); // Reset the form fields
    }else{
        alert("Invalid username or password."); // Show error message
    }
});

logoutBtn.addEventListener("click", () => {
  isAdminLoggedIn = false; // Set admin login flag to false
  alert("Logged out successfully!"); // Show success message
  loginFormEl.style.display = "block"; // Show login form
  adminPanelEl.style.display = "none"; // Hide admin panel
  renderBooks(); // Re-render book list
});

// Initial rendering of book list
renderBooks(); // Render book list on page load
renderCart(); // Render cart on page load
