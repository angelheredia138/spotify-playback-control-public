# Spotify Playback Control App

This is a React + Django app to control Spotify playback. The app includes user sign-in using Spotify authentication and utilizes the Chakra UI framework for style. If you're wondering why there are very little commits to this repo, it's cause I had my own private repo where I had pushed my client_id and secret_id, and I don't think I should share that! I will be updating this public repo with any changes I make in the future!

## Features

- Play, pause, skip, and restart Spotify tracks
- Shuffle and unshuffle playback
- View currently playing track
- Control volume
- Select playlists to play
- Responsive design with support for both portrait and landscape modes

## Getting Started

### Prerequisites

- Node.js
- Python 3.8 or higher
- Spotify Developer Account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/spotify-playback-control-public.git
   cd spotify-playback-control-public
   ```

2. **Backend Setup:**

   ```bash
   cd spotify_backend
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   pip install django djangorestframework django-cors-headers python-dotenv requests
   ```

3. **Frontend Setup:**

   ```bash
   cd ../spotify-playback-control-public 
   npm install
   ```

4. **Spotify API Setup:**

   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in.
   - Click on **Create an App**.
   - Fill out the necessary details and click **Create**.
   - After creating the app, you will be provided with a **Client ID** and **Client Secret**.
   - Add `http://localhost:8000/api/spotify-callback/` to the Redirect URIs in your app settings.

5. **Configuration:**

   Open `spotify_backend/api/utils.py`, `spotify_backend/spotify_backend/settings.py`, as well as `src/components/SpotifyAuth.jsx` and replace the placeholder values with your Spotify Client ID and Client Secret:

   ```python
   SPOTIFY_CLIENT_ID = 'your_spotify_client_id'
   SPOTIFY_CLIENT_SECRET = 'your_spotify_client_secret'
   ```

### Running the App

1. **Start the backend server:**

   ```bash
   cd spotify_backend
   python manage.py runserver
   ```

2. **Start the frontend development server:**

   ```bash
   cd ../spotify-playback-control-public
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## Deployment

For deployment, you can use platforms like Heroku, Vercel, or DigitalOcean. If you plan to host this app on a Raspberry Pi or any other local server, ensure that your environment variables and settings are configured properly for the production environment.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
