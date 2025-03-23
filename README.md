# 🌤️ Weather App

A modern weather forecasting app built with *React (Vite)* on the frontend and *Node.js (Express)* on the backend. It fetches long-term forecasts for Lithuanian cities and logs user-selected city interactions in the backend.

* Limitations: this app can only source locations from Lithuania and some of it's neighbours.

---

## 📌 What It Does

- Displays current weather info for selected Lithuanian cities.
- Shows a *5-day forecast*, including:
  - Daily high/low temperature
  - Humidity
  - Wind speed
  - Weather condition icons
- Logs selected city and timestamp to a Node.js backend console.
- Supports dynamic routing (e.g. /vilnius, /kaunas, etc).

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Vite](https://vitejs.dev/) (comes with dev dependencies)

---

## 🖥️ Frontend Setup (React + Vite)

cd frontend
npm install
npm run dev

- App will run on http://localhost:5173
- You can navigate to a city by changing the route:  
  http://localhost:5173/vilnius

---

## 🖧 Backend Setup (Node.js)

cd backend
npm install
node server.js

- Backend runs on http://localhost:3001
- Listens for POST requests to /log-city
- Logs example:
  
  [3/23/2025, 14:32:10] User selected city: Vilnius
  

---

## 🧪 How to Use the App

1. Start both frontend and backend servers (see above).
2. Open your browser and go to http://localhost:5173.
3. Click on or navigate to a city route like /vilnius or /klaipeda.
4. View:
   - Current temperature
   - Weather icon
   - Wind speed and humidity
   - 5-day forecast tiles
5. Each city selection logs a message in the Node.js console backend.

---

## ✨ Features

- 📍 *Dynamic city selection via URL*
- 📊 *Real-time 5-day forecast* display
- 🌬️ *Wind speed and humidity*
- 🖼️ *Weather condition icons* (sun, rain, clouds, etc.)
- 📅 *Human-readable date formatting*
- 🧠 *City normalization* (e.g., handles uppercase, diacritics)
- 📝 *User interaction logging* to backend for analytics

---

## 📁 Folder Structure

```
├── backend/                # Node.js logging server
│   └── server.js
├── frontend-app/           # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Weather.jsx
│   │   └── components/
│   └── ...

```

## GCP deployment
update vite.config.js and backend urls
```
# Deploy weather-app to Google Cloud Run
# Open terminal and run the following commands
# Authenticates the current user with Google Cloud using a web browser
gcloud auth login

# Configures Docker to authenticate with Google Artifact Registry
gcloud auth configure-docker

# Creates a new Docker Artifact Registry named 'weather-repo' in region europe-west10
gcloud create artifact registry weather-repo --location=europe-west10

# Builds the Docker image and uploads it to the Artifact Registry with the given tag
gcloud builds submit --tag europe-west10-docker.pkg.dev/<GCP_PROJECT_ID>/weather-repo/weather-app:v1

# Deploys the Docker image to Cloud Run in region europe-west10, making it publicly accessible
gcloud run deploy weather-app --region europe-west10 --allow-unauthenticated --image europe-west1-docker.pkg.dev/<GCP_PROJECT_ID>/weather-repo/weather-app:v1
```

## 🔧 Future Improvements (Ideas)

- Store logs in a file or database
- Add city autocomplete or search
- Deploy to GCP / MongoDb
- Add unit tests and CI pipeline

---

## 📜 License

MIT License. Feel free to fork and build upon it!

---

## 👨‍💻 Author

Made with ☀️ by Ieva Bendikiene