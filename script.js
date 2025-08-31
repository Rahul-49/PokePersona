// --- DOM Elements ---
const fileUpload = document.getElementById("file-upload");
const pokemonResultDiv = document.getElementById("pokemon-result");
const apiKeyModal = document.getElementById("apiKeyModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const submitApiKeyBtn = document.getElementById("submitApiKey");

// --- API Configuration (to be filled by user) ---
let API_KEY = null;

window.addEventListener("load", () => {
    apiKeyModal.style.display = "flex"; // show modal
    document.body.style.overflow = "hidden";
});

// Handle API Key submission
submitApiKeyBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();

    if (!key) {
        alert("API key cannot be empty.");
        return;
    }

    API_KEY = key;

    apiKeyModal.style.display = "none";
    document.body.style.overflow = "auto";
});

// --- Event Listener for File Upload ---
fileUpload.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Show loading state
    pokemonResultDiv.innerHTML = '<div class="loader"></div><p>Gemini is analyzing...</p>';

    // 2. Read the file as Data URL
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        const imageDataUrl = reader.result;

        try {
            // 3. Analyze with Gemini
            const analysis = await analyzeImageWithGemini(imageDataUrl);
            if (analysis?.pokemon_name) {
                await fetchAndDisplayPokemon(analysis.pokemon_name, analysis.description);
            } else {
                pokemonResultDiv.innerHTML = "<p>Could not determine a Pokémon. Try again!</p>";
            }
        } catch (error) {
            console.error("Error:", error);
            pokemonResultDiv.innerHTML = "<p>An error occurred. Check console for details.</p>";
        }
    };

    reader.onerror = (error) => {
        console.error("File reading error:", error);
        pokemonResultDiv.innerHTML = "<p>There was an error reading the file.</p>";
    };
});

// --- Function to Analyze Image with Gemini ---
async function analyzeImageWithGemini(imageDataUrl) {
    const prompt = `
You are a Pokémon specialist who matches people to Pokémon by looking at their faces. 
Study this person's photo and pick the one Pokémon they resemble the most.

Guidelines:
- Don't give the same Pokémon twice — always mix it up.
- Think across different types of Pokémon, for example:
  • Cute ones (Pikachu, Eevee, Jigglypuff, Togepi, Mew etc.)
  • Powerful ones (Charizard, Blastoise, Machamp, Gyarados, Dragonite etc.)
  • Quirky or unique ones (Psyduck, Snorlax, Meowth, Gengar, Squirtle etc.)
  • Legendary ones (Mew, Celebi, Lugia, Ho-Oh, Rayquaza etc.)
  • Classics (Bulbasaur, Charmander, Pichu, Raichu, etc.)

When comparing, pay attention to:
1. Face shape (round, oval, square, heart-shaped)
2. Eyes (their size, shape, or vibe — friendly, mischievous, serious, etc.)
3. Overall expression and personality feel
4. Any special features that stand out

Response format:
Always reply in JSON only, like this:

{
  "pokemon_name": "Pokémon Name",
  "description": "You're similar to [Pokémon Name] — [2-3 fun sentences explaining why this Pokémon fits]."
}
`;


    const imageBase64 = imageDataUrl.split(",")[1]; // Strip prefix

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: imageBase64,
                                },
                            },
                        ],
                    },
                ],
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log("Gemini raw output:", text);

    try {
        // ✅ Clean Markdown fences if Gemini adds them
        let cleanText = text
            .replace(/```json/i, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanText);
    } catch (err) {
        console.error("Failed to parse Gemini JSON:", err, "Raw text:", text);
        return null;
    }
}


// --- Function to Fetch Pokémon Data and Display It ---
async function fetchAndDisplayPokemon(name, description) {
    try {
        const pokemonName = name.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error(`Pokémon "${name}" not found.`);
        }

        const data = await response.json();
        const imageUrl = data.sprites.other["official-artwork"].front_default;

        pokemonResultDiv.innerHTML = `
            <h3>${data.name}</h3>
            <img src="${imageUrl}" alt="Image of ${data.name}" width="200">
            <p>${description}</p>
        `;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        pokemonResultDiv.innerHTML = `<p>Could not find Pokémon "${name}". Try again!</p>`;
    }
}
