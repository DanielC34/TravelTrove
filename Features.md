

---

# TravelTrove 🧭

An AI-powered itinerary generator built with the MERN stack and Gemini 2.5 Pro for content generation. The goal of PathFinder is to help users generate personalized travel itineraries quickly and efficiently while maintaining flexibility to edit and customize results.

---

## 📌 Project Overview

PathFinder enables users to:

* Enter travel preferences (destination, budget, duration, activities, etc.)
* Generate an AI-crafted itinerary via Gemini 2.5 Pro
* Review, save, and edit itineraries
* Eventually share or download itineraries for personal use

The project leverages the **MERN stack** for scalability and **AI integration** for smart content generation.

---

## 🚀 Current Status

At present, the app includes:

* **Basic frontend**:

  * A text input box where the user can provide travel prompts.
  * AI-generated content returned successfully via Gemini 2.5 Pro.
  * This has been tested 3 times and works correctly for returning itineraries.

* **Backend**:

  * Initial setup exists (Node.js + Express), but endpoints and data models are not fully defined.
  * AI call logic exists in a rudimentary form but requires rework for stability and scalability.

---

## 🛠️ Features (Planned)

The following features will be developed as part of the MVP:

### 1. AI Content Generation ✅ (needs rework)

* Prompt user input → Send to Gemini → Return itinerary response.
* Currently working but requires:

  * Better structured prompt design.
  * Error handling for failed requests.
  * Consistent formatting of results (e.g., JSON structure instead of raw text).

### 2. User Input Form ⚠️ (incomplete)

* Capture structured travel preferences (location, budget, duration, activities).
* Replace current simple text box with multi-field form.
* Validation required for user inputs.

### 3. Itinerary Management ⚠️ (missing)

* Save itineraries to database (MongoDB).
* Edit existing itineraries.
* Delete itineraries.
* List view of all generated itineraries.

### 4. Authentication ⚠️ (missing)

* User sign up/login (JWT-based).
* Secure storage of itineraries per user.

### 5. UI/UX ⚠️ (basic only)

* Add layout with navbar, home page, and results page.
* Improve readability of AI-generated itineraries.
* Add options to edit/re-run generation with modified parameters.

### 6. Export & Share (Optional, Post-MVP)

* Export itineraries as PDF.
* Share itineraries via a unique link.

---

## 📄 Pages (Planned)

### 1. Home Page

* Purpose: Introduce PathFinder.
* Content: Short tagline + button to start planning.

### 2. Itinerary Generator Page

* Purpose: Collect user preferences + generate itinerary.
* Content:

  * Input form (destination, duration, budget, activities).
  * Submit button → call backend → return AI-generated itinerary.
  * Display results.

### 3. My Itineraries Page

* Purpose: List of user’s saved itineraries.
* Content:

  * Each itinerary with preview.
  * Options: Edit | Delete | View full details.

### 4. Itinerary Details Page

* Purpose: Show full itinerary.
* Content:

  * Daily breakdown of activities.
  * Buttons to edit or export.

### 5. Login / Register Page

* Purpose: User authentication.
* Content: Email/password form.

---

## 🔎 Known Issues & Missing Implementation

* **AI content generation**: Currently works, but response format is inconsistent → needs refactor.
* **Backend**: Missing API endpoints for CRUD on itineraries.
* **Database**: No schema for itineraries or users has been implemented yet.
* **Frontend**:

  * UI is extremely minimal (single textbox).
  * Needs structured forms, results display, and navigation.
* **Auth**: Not implemented.
* **Testing**: No tests exist yet.

---

## ✅ Next Steps (Suggested Order of Development)

1. **Backend foundation**

   * Define User + Itinerary models (MongoDB).
   * Build Express routes for itineraries (CRUD).
   * Implement authentication (JWT).

2. **Frontend structure**

   * Add routing (React Router).
   * Build pages (Home, Generator, My Itineraries, Login/Register).

3. **AI integration rework**

   * Create structured prompt templates.
   * Parse AI responses into JSON.
   * Render itineraries dynamically.

4. **UI enhancements**

   * Add navbar + consistent layout.
   * Improve itinerary readability.

5. **Persistence & user experience**

   * Save itineraries per user.
   * Enable edits and re-generation.

6. **Optional features (post-MVP)**

   * Export to PDF.
   * Share itineraries.

---

## 📂 Project Structure (Planned)

```
PathFinder/
│── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── itineraryRoutes.js
│   │   └── authRoutes.js
│   ├── controllers/
│   │   ├── itineraryController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── Itinerary.js
│   │   └── User.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── utils/
│       └── geminiService.js
│
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── GeneratorPage.tsx
│   │   │   ├── MyItinerariesPage.tsx
│   │   │   ├── ItineraryDetailsPage.tsx
│   │   │   └── AuthPage.tsx
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│
│── README.md
│── package.json
```

---
