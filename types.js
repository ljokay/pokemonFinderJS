const pokemonType = document.getElementById("pokemonType");
const typeName = document.getElementById("typeName");

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

let resistances = [];
let weaknesses = [];
let immunities = [];

const typeClasses = {
    fire: "fire",
    water: "water",
    electric: "electric",
    psychic: "psychic",
    fairy: "fairy",
    ghost: "ghost",
    dark: "dark",
    normal: "normal",
    ice: "ice",
    flying: "flying",
    poison: "poison",
    fighting: "fighting",
    ground: "ground",
    rock: "rock",
    grass: "grass",
    bug: "bug",
    steel: "steel",
    dragon: "dragon"
};

function containerClear (container) {
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
}

function clearTypes() {
    resistances = [];
    weaknesses = [];
    immunities = [];
}

async function getType(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}

function resistancesCalc(type) {
    for (let i = 0; i < type.damage_relations.half_damage_from.length; i ++) {
        if (resistances.includes(type.damage_relations.half_damage_from[i].name)){
            continue;
        }
        else {
            resistances.push(type.damage_relations.half_damage_from[i].name)
        }
    }
}

function weaknessCalc(type) {
    for (let i = 0; i < type.damage_relations.double_damage_from.length; i ++) {
        if (weaknesses.includes(type.damage_relations.double_damage_from[i].name)){
            continue;
        }
        else {
            weaknesses.push(type.damage_relations.double_damage_from[i].name)
        }
    }
}

function immunityCalc(type) {
    for (let i = 0; i < type.damage_relations.no_damage_from.length; i ++) {
        if (immunities.includes(type.damage_relations.no_damage_from[i].name)){
            continue;
        }
        else {
            immunities.push(type.damage_relations.no_damage_from[i].name)
        }
    }
}

async function displayAffinities () {
    try {
        document.getElementById("page2con").classList.add("right");
        const typeOne = await getType(pokemonType.value.toLowerCase());
        typeName.textContent = capitalizeFirstLetter(pokemonType.value);
        document.getElementById('weakHead').textContent = "Weaknesses";
        document.getElementById('resistsHead').textContent = "Resistances";
        document.getElementById('immuneHead').textContent = "Immunities";
        const pokemonWeaknessCon = document.getElementById("pokemonWeakness");
        const pokemonResistsCon = document.getElementById("pokemonResists");
        const pokemonImmuneCon = document.getElementById("pokemonImmunities")
        const weaknessList = document.createElement('ul');
        const resistList = document.createElement('ul');
        const immuneList = document.createElement('ul');
    
        containerClear(pokemonWeaknessCon);
        containerClear(pokemonResistsCon);
        containerClear(pokemonImmuneCon);

    

        resistancesCalc(typeOne);
        weaknessCalc(typeOne);
        immunityCalc(typeOne);
        function updateHTML(item) {
            let immuneTest = 0;
            let resistanceTest = 0
            item.forEach(function(i) {
                const typeItem = document.createElement('li');
                if (typeClasses.hasOwnProperty(i)) {
                typeItem.classList.add(typeClasses[i]);
                }
                typeItem.textContent = capitalizeFirstLetter(i);
                typeItem.classList.add('typeItem');

                if (item === resistances) {
                    resistList.appendChild(typeItem);
                    pokemonResistsCon.appendChild(resistList);
                    resistanceTest += 1;
                }
                else if (item === weaknesses) {
                    weaknessList.appendChild(typeItem);
                    pokemonWeaknessCon.appendChild(weaknessList);
                }
                else if (item === immunities) {
                    immuneList.appendChild(typeItem);
                    pokemonImmuneCon.appendChild(immuneList);
                    immuneTest += 1;
                }
            })

            if (item === immunities && immuneTest === 0) {
                const noImmune = document.createElement('li');
                noImmune.textContent = "No Immunities"
                immuneList.appendChild(noImmune);
                pokemonImmuneCon.appendChild(immuneList);
            }
            if (item === resistances && resistanceTest === 0) {
                const noResist = document.createElement('li');
                noResist.textContent = "No Resistances"
                resistList.appendChild(noResist);
                pokemonResistsCon.appendChild(resistList);
            }
        }
        try {
            updateHTML(resistances);
            updateHTML(weaknesses);
            updateHTML(immunities);
        
            clearTypes();
        }
        catch(error) {
            console.log(error);
        }
    }
    catch (error) {
        document.getElementById('weakHead').textContent = "Not Valid Type :(";
    }
}

if (pokemonType) {
    pokemonType.addEventListener("keydown", enterKeyType);
}
async function enterKeyType (e) {
    if (e.key == "Enter") {
        displayAffinities();
    }
}

pokemonType.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.preventDefault(); 
        this.value += "-"; // 
    }
});
