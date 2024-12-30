Teebay: Simple Product Renting and Buying/Selling Application - Implementation Guide

Overview
Teebay is a web application designed for renting, buying, and selling products. It provides an intuitive platform with features such as product listings, transactions, and product management. This documentation outlines the implementation of each feature and challenges faced during development.

Tech Stack
•	Frontend: React, Apollo Client, GraphQL, Tailwind CSS
•	Backend: NestJS, TypeScript, Prisma, GraphQL, PostgreSQL
•	Authentication: Basic string matching for user login (no JWT-based authentication).

Feature Implementation

1.	Landing Page (Teebay)
   
Problem:

The landing page should engage users and direct them to sign up or sign in to use the marketplace.
Solution:
•	Created a Landing Page component with the app's name and buttons for Sign Up and Sign In.
•	These buttons navigate users to the sign-up or sign-in pages.
•	A section explains the platform's benefits: renting, buying, and selling.

3.	User Authentication (Sign-Up and Sign-In)
Problem:
Authentication is needed to manage personalized user features like product interactions.
Solution:
•	Built Signup Form and Sign In components for users to register and log in.
•	Used basic string matching to validate user credentials against stored data in PostgreSQL.
•	After successful login, users are redirected to the homepage or dashboard.

4.	Homepage (Product Listings)
Problem:
The homepage should display available products for rent or sale, with options to buy or rent them.
Solution:
•	Integrated Apollo Client to fetch product data using GraphQL.
•	Products show name, description, price, rental price, and status.
•	Buy and Rent buttons:
o	Buy: Marks the product as sold.
o	Rent: Initiates the rental process with a specified duration.
•	Filters out products listed by the user to prevent them from interacting with their own products.
•	Sorted products by availability status (showing "AVAILABLE" products first).

5.	My Products (User Product Management)
Problem:
Users need to manage their own listed products for sale or rent.
Solution:
•	MyProducts page shows products listed by the logged-in user.
•	Users can edit or delete their products.
•	Used user ID (stored in localStorage) to fetch products associated with the current user.

6.	Product Creation (Add Product Wizard)
Problem:
Users should be able to list their products for sale or rent easily.
Solution:
•	Created AddProductWizard, a multi-step form where users enter product details (name, description, price, rental price, categories, availability).
•	After form submission, a GraphQL mutation (CREATE_PRODUCT) adds the new product to the database.
•	Upon successful creation, users are redirected to their "My Products" page.

7.	Transactions (Buy and Rent History)
Problem:
Users should be able to view their transaction history for rented and purchased products.
Solution:
•	The TransactionsPage fetches and displays transactions linked to the logged-in user.
•	Displays information like rented products and purchase details as well as borrowed and lent details.

8.	Routing and Navigation
Problem:
The app needs smooth navigation between pages like signing up, logging in, viewing products, and managing listings.
Solution:
•	React Router handles routing between different pages.
•	Defined routes for:
o	LandingPage: /
o	SignUpForm: /signup
o	SignIn: /signin
o	HomePage: /homepage
o	MyProducts: /myproducts
o	TransactionsPage: /transactions
o	UpdateProductPage: /updateproduct
o	AddProductWizard: /addproduct


9.	Handling Edge Cases
Problem:
Need to handle scenarios like users trying to rent or buy their own products, or interacting with products already rented or sold.
Solution:
•	Own Product Rental/Buying: Products owned by the user are excluded from rental/buy options.
•	Sold/Rented Products: These products show their status and disable the Rent/Buy buttons.
•	Rental Duration Validation: Ensures users enter a valid rental duration and shows an error message if invalid.

10.	Styling and User Experience
Problem:
The app must be visually appealing and responsive for all devices.
Solution:
•	Tailwind CSS provides a modern, responsive design.
•	Ensured good user experience across desktop and mobile with proper spacing, fonts, and buttons.
•	Visual feedback for success or error actions.

Conclusion
Teebay is a simple yet effective platform for renting, buying, and selling products. Built with React.js, GraphQL, Prisma, and PostgreSQL, the app provides an efficient, scalable solution for users. The use of basic string matching for login simplifies authentication, while addressing important edge cases like preventing users from interacting with their own products.
Future Enhancements:
•	Product Search: Add a feature to search products by name or category.
•	Product Ratings: Implement a rating system for products and users.
•	Admin Dashboard: Create an admin dashboard to manage users and products.
•	Cart System: Creating a cart system.
