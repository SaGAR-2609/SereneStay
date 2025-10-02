
---

# SereneStay

SereneStay is a full-stack web application inspired by Airbnb, designed for booking hotels and villas worldwide. With SereneStay, users can explore listings, view details, and plan their travel accommodations seamlessly.

---

## Features

* Browse all available accommodations on a visually appealing listings page
* View detailed information about each listing including title, description, image, price, location, and country
* Read the reviews of a particular listing
* Simple and clean UI for seamless user experience
* Server-side rendering using EJS for faster load times and better SEO
* MongoDB integration with Mongoose for flexible and scalable data handling

---

## Tech Stack

**Frontend**

* EJS for server-side rendering
* Tailwind CSS for styling and responsive design

**Backend**

* Node.js with Express framework
* EJS templating engine
* MongoDB as the database, managed via Mongoose
* Passport for user account management

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SaGAR-2609/SereneStay.git
   cd SereneStay
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up MongoDB**

   * Ensure MongoDB is running locally or specify a remote MongoDB URI
   * Update the connection URL in your configuration or environment variables if needed

4. **Seed the database (if applicable)**

   * If there is a seeding script or `init.js` file:

     ```bash
     node init.js
     ```

5. **Start the application**

   ```bash
   node app.js
   ```

   or with `nodemon`:

   ```bash
   nodemon app.js
   ```

6. **Access the app**
   Open your browser and go to `http://localhost:8080` .

---

## Usage

* Navigate to the All Listings page to see an overview of all available listings.
* Click on any listing card to view its detail page, showcasing all the relevant information.

---

## Project Structure

```
SereneStay/
├── app.js                # Main application entry point
│
├── middleware.js         # All the middlewares
│
├── schema.js             # Schema for Joi
│
├── models/
│   ├── listings.js       # Mongoose schema and model for listings
│   ├── reviews.js        # Mongoose schema and model for reviews
│   └── users.js          # Mongoose schema and model for users
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── edit.ejs      # To edit a listing
│   │   ├── index.ejs     # All Listings page
│   │   ├── new.ejs       # Creating a new Listing page
│   │   └── show.ejs      # Listing details page
│   │
│   ├── includes/
│   │   ├── flash.ejs     # For flashing a message
│   │   ├── footer.ejs    # For flashing a message
│   │   └── navbar.ejs    # For flashing a message
│   │
│   ├── users/
│   │   ├── login.ejs     # For logging in a user
│   │   └── signup.ejs    # For signing up a user
│   │
│   └── error.ejs         # Handling all the errors
│
├── public/               # Static files (CSS, JS, images)
│
├── utils/                # Utility modules and error handlers
│
├── init/                 # Seed data and scripts (e.g., sampleListings)
│   │   ├── index.js      # For initializing the data
│   │   └── data.js       # Contains all the listing data
│   │
├── routes/               
│   │   ├── listing.js    # Contains all the routes starting with listing
│   │   ├── review.js     # Contains all the routes starting with listing/:id/review
|   |   └── users.js      # Contains all the routes starting with user
│   
├── package.json
└── README.md
```

---

## Contributing

We welcome contributions! Feel free to:

* Fix bugs or improve performance
* Add new features like search, filtering, etc.
* Enhance styling or usability

**To contribute:**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m "Description of your changes"`)
4. Push to your fork (`git push origin feature/name`)
5. Open a Pull Request for review

---