# PokePersona🔍➡️🐾

A fun web app that takes your photo, analyzes it with **Google Gemini AI**, and tells you which **Pokémon** you most resemble. It even pulls official Pokémon artwork and stats from the **PokéAPI** to make the match come alive.  

---

## 🚀 Features
- 📸 Upload a photo of yourself (or a friend)  
- 🤖 AI-powered face analysis using **Gemini**  
- 🎭 Matches you with a **Pokémon personality twin**  
- 🖼️ Displays official Pokémon artwork and name via **PokéAPI**  
- 🎉 Always returns varied and unique Pokémon (no repeats)  

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **AI Model**: Google Gemini API (image + text generation)  
- **Pokémon Data**: [PokéAPI](https://pokeapi.co/)  

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```
   git clone https://github.com/your-username/pokematch.git
   cd pokematch
Open the project in your browser
Simply open index.html in your browser.

Provide your Gemini API key

On page load, you’ll see an API Key modal.

Paste your key (get one from Google AI Studio).

The app will store it temporarily in memory (not saved permanently).

🎮 Usage
Click the upload button and select a photo.

The app will:

Send your image + prompt to Gemini.

Parse the JSON response.

Fetch Pokémon artwork from PokéAPI.

See your Pokémon twin with an explanation of the match.

🖼️ Example Output
{
  "pokemon_name": "Snorlax",
  "description": "You're similar to Snorlax — relaxed, easygoing, and always ready to enjoy the simple things. People feel calm around you, and you know how to take life at your own pace."
}
The app will then show Snorlax’s official image and description on the screen.

⚠️ Notes & Limitations
Requires a valid Gemini API key.

Works best with clear, front-facing photos.

Some Pokémon names may not exist in PokéAPI (legendary variants, etc.).
