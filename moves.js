const pokemonMove = document.getElementById("pokemonMove")
pageTwoEffectName = document.getElementById("abName");
pageTwoEffectDesc = document.getElementById("abDesc");

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getMove(moveName) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.");
        }
        return await response.json();
}

async function moveCreate() {
    document.getElementById("page2con").classList.add("right");
    const data = await getMove(pokemonMove.value.toLowerCase());
    let moveEffect = data.effect_entries.find(entry =>{
        return entry.language.name ==="en";
    })
    pageTwoEffectName.textContent = capitalizeFirstLetter(data.name);
    pageTwoEffectDesc.textContent = moveEffect.effect;
}


if (pokemonMove) {
    pokemonMove.addEventListener("keydown", enterKeyMove);
}
async function enterKeyMove (e) {
    if (e.key == "Enter") {
        moveCreate();
    }
}

pokemonMove.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.preventDefault(); 
        this.value += "-"; // 
    }
});