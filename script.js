const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const pokemonList = document.getElementById('pokemon-list');
const errorMessage = document.getElementById('error-message');

async function fetchPokemons(limit = 50, offset = 0) {
    try {
        pokemonList.innerHTML = '';
        errorMessage.textContent = '';
        const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Failed to fetch Pokémon list.');
        const data = await response.json();
        for (const pokemon of data.results) {
            const pokemonDetails = await fetchPokemonDetails(pokemon.url);
            displayPokemon(pokemonDetails);
        }
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
    }
}

async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Pokémon details.');
    return response.json();
}

function displayPokemon(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${pokemon.name.toUpperCase()}</h3>
        <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Height: ${(pokemon.height / 10).toFixed(1)} m</p>
        <p>Weight: ${(pokemon.weight / 10).toFixed(1)} kg</p>
    `;
    pokemonList.appendChild(card);
}

async function searchPokemon() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    if (!searchInput) {
        errorMessage.textContent = 'Please enter a Pokémon name.';
        return;
    }
    try {
        errorMessage.textContent = '';
        pokemonList.innerHTML = '';
        const response = await fetch(`${BASE_URL}${searchInput}`);
        if (!response.ok) throw new Error('Pokémon not found.');
        const pokemon = await response.json();
        displayPokemon(pokemon);
    } catch (error) {
        errorMessage.textContent = `Error: ${error.message}`;
    }
}

document.addEventListener('DOMContentLoaded', () => fetchPokemons(50));
