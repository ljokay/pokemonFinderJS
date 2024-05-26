pageTwoAbName = document.getElementById("abName");
pageTwoAbDesc = document.getElementById("abDesc");
const pokemonAbility = document.getElementById("pokemonAbility")

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function getAbility(abilityName) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}



async function abilityCreate() {
    document.getElementById("page2con").classList.add("right");
    const data = await getAbility(pokemonAbility.value.toLowerCase());
    let abEffect = data.effect_entries.find(entry =>{
        return entry.language.name ==="en" 
    })
    console.log(abEffect);
    pageTwoAbName.textContent = capitalizeFirstLetter(data.name);
    pageTwoAbDesc.textContent = abEffect.effect;
}

const pokemonAbilityInput = document.getElementById("pokemonAbility")
if (pokemonAbilityInput) {
    pokemonAbilityInput.addEventListener("keydown", enterKeyAbility);
}
async function enterKeyAbility (e) {
    if (e.key == "Enter") {
        abilityCreate();
    }
}

pokemonAbility.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.preventDefault(); 
        this.value += "-"; // 
    }
});