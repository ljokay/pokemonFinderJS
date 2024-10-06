//DOM Variables
const darkMode = document.getElementById('dmt');
const body = document.body;
const pokeName = document.getElementById("name");
const pokemonWeaknessCon = document.getElementById("pokemonWeakness");
const pokemonResistsCon = document.getElementById("pokemonResists");
const pokemonImmuneCon = document.getElementById("pokemonImmunities");
const abCon = document.getElementById("ab-con");
const moveCon = document.getElementById("move-con");
const moveDesCon = document.getElementById("move-des-con");
const gen = document.getElementById("gen");
const ab = document.getElementById("ability");
const abHeader = document.getElementById("abHeader");
const moveText = document.getElementById("move-head");
const pName = document.getElementById("pokemonName");
const pokemonTypesCon = document.getElementById("pokemonTypes");
const imgElement = document.getElementById("pokemonSprite");

//Type Object Used For CSS Classes
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

//Resistances Calc & Container Clear
let resistances = [];
let weaknesses = [];
let immunities = [];

//Removes the Child Elements of the Input Container
function containerClear (container) {
    if (container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }
}

//Retrieves the Resistances of a Type | Does Nothing if Resistances Array Already Includes Type to Prevent Duplicates
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

//Retrieves the Weaknesses of a Type | Does Nothing if Weaknesses Array Already Includes Type to Prevent Duplicates
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

//Retrieves the Immunities of a Type | Does Nothing if Immunities Array Already Includes Type to Prevent Duplicates
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

/*Checks if the Pokemon has a Matching Weakness and Resistance, if it does, removes it from both arrays
Also Removes if they match an immunity */
function weakResChange(resistances, weaknesses, immunities) {
    let newResistances = resistances.filter(resistance => !weaknesses.includes(resistance) && !immunities.includes(resistance));
    let newWeaknesses = weaknesses.filter(weakness => !resistances.includes(weakness) && !immunities.includes(weakness));
    resistances.length = 0;
    weaknesses.length = 0;
    resistances.push(...newResistances);
    weaknesses.push(...newWeaknesses);
}

//Clears Type Arrays
function clearTypes() {
    resistances = [];
    weaknesses = [];
    immunities = [];
}

//Extra Functions
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//Dark Mode Logic
function toggleDM () {
    if(darkMode.checked) {
        body.classList.add('dark-mode');

    }
    else {
        body.classList.remove('dark-mode');
    }
    
}

// Main Method
async function generateHTML() {
    try {
        startUp();
        const pokemonName = pName.value.toLowerCase();
        const data = await getPokemonData(pokemonName);
        displaySprite(data);
        displayInfo(data, pokemonName);
        displayFlavorText(pokemonName);
        displayAbilities(data);
        displayMoves(data);
        displayAffinities(data);
    } catch (error) {
        //Clears Containers and Generated Text Content if Invalid Search Input | Notifies User of Invalid Input
        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = "Error/pokeball.png"
        document.getElementById("pokemonTypes").textContent = "";
        containerClear(pokemonWeaknessCon);
        containerClear(pokemonResistsCon);
        containerClear(pokemonImmuneCon);
        containerClear(abCon);
        containerClear(moveDesCon);
        containerClear(moveCon);
        pokeName.textContent = "";
        document.getElementById('weakHead').textContent = "";
        document.getElementById('resistsHead').textContent = "";
        document.getElementById('immuneHead').textContent = "";
        document.getElementById("info-header").textContent = "";
        abHeader.textContent = "";
        hb.textContent = "";
        hidden.textContent = ""
        gen.textContent = "";
        hidden.textContent = "";
        abHeader.textContent = "";
        moveText.textContent = "";
        pokeName.textContent = "Invalid Pokemon";
        document.querySelector(".info-con").classList.remove("right");
        console.log("error");
    }
}

// Displays Sprite
function displaySprite(data) {
    //Retrieves the Sprite of the Pokemon if the Gen V sprite exists, uses that, if not the Gen 9 is used
    imgElement.style.display = "block";
    try {
        let pokemonSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
        
        if (data.sprites.versions["generation-v"]["black-white"].animated.front_default != null) {
            pokemonSprite = data.sprites.versions["generation-v"]["black-white"].animated.front_default;
        }
        else {
            pokemonSprite = data.sprites.other["official-artwork"].front_default;
        }
        imgElement.src = pokemonSprite;
        
    }
    catch (error) {
        imgElement.src = "Error/pokeball.png";
        console.log("error");
    }
}

// Displays Name and Type Info
function displayInfo(data, pokemonName) {
    //Pokemon Name Text
    pokeName.textContent = capitalizeFirstLetter(pokemonName);

    //Clear Text Content
    document.getElementById("pokemonTypes").textContent = "";
    //Creates Types Array and Unordered List 
    const types = data.types.map(type => type.type.name)
    const typesList = document.createElement('ul');
    /*For Each Type in Types, Creates a list element adds text content, appends the item to the UL
    , Adds an image to the list element, and gives it the appropriate image icon, finally appends list to parent container*/
    types.forEach(type=> {
        const listItem = document.createElement('li');
        listItem.textContent = capitalizeFirstLetter(type);
        typesList.appendChild(listItem);
        const listImg = document.createElement('img');
        
        if (typeClasses.hasOwnProperty(type)) {
            listImg.src = "https://ljokay.github.io/pokemonFinderJS/icons/Pokemon_Type_Icon_" + capitalizeFirstLetter(type) + ".png";
        }
           
        listImg.classList.add("li-img");
        listItem.appendChild(listImg);
           
    });
       pokemonTypesCon.appendChild(typesList);
}

// Displays Flavor Text Entry
async function displayFlavorText(pokemonName) {
    //Default Generated Text
    document.getElementById("info-header").textContent = "Additional Information";
    try {
        /*Fetch Request to get Species Data to Retrive 'flavor_text_entires' that match the version and the language
        Scarlet for Newer Pokemon & Black for Older Pokemon Text Entries*/
        let species = await getSpecies(pokemonName);
        let engFlavText = species.flavor_text_entries.find(entry =>{
            return entry.language.name ==="en" && entry.version.name == "scarlet"});
        if (typeof engFlavText === "undefined") {
            engFlavText = species.flavor_text_entries.find(entry =>{
                return entry.language.name ==="en" && entry.version.name == "black"});
        }
        gen.textContent = engFlavText.flavor_text;
        }
        catch(error) {
            gen.textContent = "Not in Gen 9";
        }
}

// Displays Abilities and Info About Abilities
async function displayAbilities(data) {
    //Add Stlyling Class to Container, Sets Base HTML text, and Non-volatile Text, and Clears Container
    document.querySelector(".info-con").classList.add("right");
    abHeader.textContent = "Abilities";
    hb.textContent = "Hidden Ability";
    hidden.textContent = "No Hidden Ability"
    containerClear(abCon);
    try {
        //Loops throught data's abilities and adds ability to abilities array
        let abilities = [];
        for (let i = 0; i < data.abilities.length; i++) {
            abilities.push(data.abilities[i]);
        }
        //Loops through abilities array and fetches data on each ability, looking for the english entry
        for (const ability of abilities) {
            let abInfo = await getAbility(ability.ability.name)
            let abEffect = abInfo.effect_entries.find(entry =>{
            return entry.language.name ==="en" 
            })
        //Checks if the ability is hidden from the is_hidden boolean value
        if (ability.is_hidden != true) {
            const pkmnAb = document.createElement('p');
            pkmnAb.textContent = capitalizeFirstLetter(ability.ability.name) + ": " + abEffect.effect;
            abCon.appendChild(pkmnAb);
        }
        else if (ability.is_hidden == true) {
            hidden.textContent = capitalizeFirstLetter(ability.ability.name) + ": " + abEffect.effect;
            }
        }
    }
    catch(error) {
        ab.textContent = "Error";
        console.error("Error:", error);   
    }
}

// Displays Moves and Move Data
async function displayMoves(data) {
    moveText.textContent = "Pokemon Moves";
    let moves = data.moves;
    
    try {
        //Generates Default HTML Elements and sets their Text Content (Not API Data)
        const moveDes = document.createElement('h2');
        const accuracyDes = document.createElement('h2');
        const powerDes = document.createElement('h2');
        const effectDes = document.createElement('h2');
        moveDes.textContent = "Move";
        accuracyDes.textContent = "Accuracy";
        powerDes.textContent = "Power";
        effectDes.textContent = "Effect";

        //Clears Previous Content In Case of Repeated Uses | Appends Child Elements
        containerClear(moveDesCon);
        containerClear(moveCon);
        moveDesCon.appendChild(moveDes);
        moveDesCon.appendChild(accuracyDes);
        moveDesCon.appendChild(powerDes);
        moveDesCon.appendChild(effectDes);

        //Loops through the moves the Pokemon has 
        for (const move of moves) {
            let moveInfo = await getMove(move.move.name)
            //Finds the entry in the array that is english by checking if the name ke is equal to "en"
            let moveEffect = moveInfo.effect_entries.find(entry =>{
                return entry.language.name ==="en"
            })
            //Creates List Elements for Information from API
            const pkmnMove = document.createElement('ul');
            const accuracy = document.createElement('ul');
            const power = document.createElement('ul');
            const effect = document.createElement('ul');

            //Sets the Text Content of Generated HTML Elements to the Value of the Keys
            pkmnMove.textContent = capitalizeFirstLetter(moveInfo.name);
            accuracy.textContent = capitalizeFirstLetter(moveInfo.accuracy != null ? moveInfo.accuracy.toString() : "N/A");
            power.textContent = capitalizeFirstLetter(moveInfo.power != null ? moveInfo.power.toString() : "N/A");
            effect.textContent = moveEffect.short_effect;

            //Adds a CSS class for Type Color
            if (typeClasses.hasOwnProperty(moveInfo.type.name)) {
                pkmnMove.classList.add(typeClasses[moveInfo.type.name]);
            }

            //Adds additional CSS classes for styling and appends the Child to the container
            pkmnMove.classList.add("moveTypes");
            pkmnMove.classList.add("bold-txt");
            moveCon.appendChild(pkmnMove);
            moveCon.appendChild(accuracy);
            moveCon.appendChild(power);
            moveCon.appendChild(effect);
        
        }
    }
    catch(error) {
        console.log(error);
    }
}

async function displayAffinities (data) {
    //Generate Text Content of Non-Volatile HTML Elements
    document.getElementById('weakHead').textContent = "Weaknesses";
    document.getElementById('resistsHead').textContent = "Resistances";
    document.getElementById('immuneHead').textContent = "Immunities";
    
    //Create Lists For Type List Elements
    const weaknessList = document.createElement('ul');
    const resistList = document.createElement('ul');
    const immuneList = document.createElement('ul');

    //Clear previous containers if used more than once
    containerClear(pokemonWeaknessCon);
    containerClear(pokemonResistsCon);
    containerClear(pokemonImmuneCon);
    
    //Creates an Array of Types the Pokemon has, defines the first type, and applies apropriate functions to the Type
    const types = data.types.map(type => type.type.name);
    const typeOne = await getType(types[0]);
    resistancesCalc(typeOne);
    weaknessCalc(typeOne);
    immunityCalc(typeOne);

    //Updates The Types | Checks for duplicates
    function updateHTML(item) {
        //Used to Check if 0 Immunities or Resistances occur
        let immuneTest = 0;
        let resistanceTest = 0

        //Creates List Element for each item in array and appropriately adds them to correct container, while assigning correct CSS class
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

        //Different Text Content if there are Zero Immunities or Resistances
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

    //If More than 1 Type, Define the Second Type and Apply Appropriate Functions to Type
    try {
        if (types.length > 1) {
            const typeTwo = await getType(types[1]);
            resistancesCalc(typeTwo);
            weaknessCalc(typeTwo);
            immunityCalc(typeTwo);
            weakResChange(resistances, weaknesses, immunities);
            
        }
        updateHTML(resistances);
        updateHTML(weaknesses);
        updateHTML(immunities);
        
        clearTypes();
    }
    catch(error) {
        console.log(error);
    }
    
}

//Additional Data Get Requests
//Get Pokemon's Data
async function getPokemonData(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) {
        throw new Error("Couldn't find data.");
    }
    return await response.json();
}

//Get Species Data
async function getSpecies(pokemonName) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}

//Get Ability Data
async function getAbility(abilityName) {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}

//Get Move Data
async function getMove(moveName) {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}

//Get Type Data
async function getType(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        if(!response.ok) {
            throw new Error("Couldn't find data.")
        }
        return await response.json();
}

//Enter Key Functionality | Changes spacebar into '-' for API functionality purposes
if (pName) {
    pName.addEventListener("keydown", enterKeyPoke);
}

async function enterKeyPoke (e) {
    if (e.key == "Enter") {
        generateAndCenter();
    }
}

pName.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        event.preventDefault(); 
        this.value += "-"; // 
    }
});


//Additional Functions
//Scrolls to top of page on startup
async function startUp() {
    document.addEventListener("DOMContentLoaded", async function() {
        await generateHTML;
        setTimeout(scrollToTop, 100);
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onload = function() {
    scrollToTop();
};

//Scrolls Generated HTML into view
function centerViewport() {
    const targetElement = document.querySelector('.card');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function generateAndCenter() {
    await generateHTML();
    setTimeout(centerViewport, 100);
}