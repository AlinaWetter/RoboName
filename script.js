let definitions = [];
let urls = [];
let characters = [];


/**
 * This function is used to initialize the website
 */
function init() {
    showCards();
}


/**
 * This function is used to save Data in local storage 
 */
async function saveToLocalStorage() {
    let definitionsAsText = JSON.stringify(definitions);
    let urlsAsText = JSON.stringify(urls);
    let charactersAsText = JSON.stringify(characters);

    localStorage.setItem('definitions', definitionsAsText);
    localStorage.setItem('urls', urlsAsText);
    localStorage.setItem('characters', charactersAsText);
}


/**
 * This function is used to get Data from local storage
 */
async function loadFromLocalStorage() {
    let definitionsAsText = localStorage.getItem('definitions');
    let urlsAsText = localStorage.getItem('urls');
    let charactersAsText = localStorage.getItem('characters');

    if (definitionsAsText && urlsAsText && charactersAsText) {
        definitions = JSON.parse(definitionsAsText);
        urls = JSON.parse(urlsAsText);
        characters = JSON.parse(charactersAsText);
    }
}


/**
 * This function is used to show existing Cards
 */
async function showCards() {
    await loadFromLocalStorage();

    clearContent(); 
    createAddCard();
    for (let i = definitions.length - 1; i >= 0; i--) {
        drawCard(i);
    }
}


/**
 * This function is used to clear content
 */
function clearContent() {
    let contentDiv = document.getElementById('contentDiv');
    contentDiv.innerHTML = '';
}


/**
 * This function is used to draw one specific card
 * 
 * @param {number} i - Index of the created object
 */
function drawCard(i) {
    let url = urls[i];
    let definition = definitions[i];
    let size = getSizeOfImage(url);
    let character = characters[i];
    document.getElementById('contentDiv').innerHTML += newCardHtml(url, definition, size, character, i);
    setColor(character, i);
}


/**
 * This function is used to add and remove the class d-none
 */
function openInputDiv() {
    document.getElementById('plusImg').classList.add('d-none')
    document.getElementById('inputDiv').classList.remove('d-none')
}


/**
 * This function is used to create the container, which has the function to add new Card
 */
function createAddCard() {
    let contentDiv = document.getElementById('contentDiv');
    contentDiv.innerHTML += addingCardHtml();
}


/**
 * This function is used to add the color to the created Object
 * 
 * @param {string} character - The kind of character, which color is going to be set
 * @param {number} i - Index of the created object
 */
function setColor(character, i) {
    document.getElementById('character' + i).style.color = specieColor(character);
}


/**
 * This function is used to define the color
 * 
 * @param {string} character - The kind of character, which color is going to be set
 * @returns {string} - The color of the character span
 */
function specieColor(character) {
    let typesAndColors =  {
        Roboter: '#dd8a64',
        Monster: '#829988',
        Katze: '#a383bc'
    }

    return typesAndColors[character];
}


/**
 * This function is used to set the Size according to the QueryParameter/Specie
 * 
 * @param {string} url -The url of the objects image
 * @returns {number} - The width of the image of the specific Card
 */
function getSizeOfImage(url) {
    if (url.includes('set1')) {
        return 230;
    };
    if (url.includes('set2')) {
        return 220;
    };
    if (url.includes('set4')) {
        return 180;
    }
}


/**
 * This function is used to create a new Card by reading the value
 * 
 * @param {string} character - The kind of character that should be created
 */
async function createCard(character) {
    let definition = document.getElementById('definition').value;

    if (definition) {
        let url = createURL(definition, character);
        await saveInformationsToArray(url, definition, character);
        document.getElementById('definition').value = '';
        showCards();
    } else {
        document.getElementById('definition').placeholder = 'Please enter valid name';   
    }
}


/**
 * This function is used to push all collected Informations in the intended array
 * 
 * @param {string} url - The url of the objects image
 * @param {string} definition - The definition of the object
 * @param {string} character - The character of the objects
 */
async function saveInformationsToArray(url, definition, character) {
    definitions.push(definition);
    urls.push(url);
    characters.push(character);
    await saveToLocalStorage();
}


/**
 * This function is used to create a valid url that includes the definition and character
 * 
 * @param {string} definition - The definition of the object
 * @param {string} character - The character of the objects
 * @returns {string} - The url for the image of the object
 */
function createURL(definition, character) {
    let URIdefinition = encodeURIComponent(definition);
    let set = getQueryParameter(character);

    return `https://robohash.org/${URIdefinition}/?set=set${set}`;
}


/**
 * This function is used to set the query Parameter (according to the character) for the url
 * 
 * @param {string} character - The character of the object
 * @returns {number} - The query parameter for the specified character
 */
function getQueryParameter(character) {
    let queryParameters = {
        Roboter: 1,
        Monster: 2,
        Katze: 4
    }

    return queryParameters[character];
}



/**
 * This function is used to delete one specific card
 * 
 * @param {number} i - Index of deleted object
 */
function deleteCard(i) {
    spliceItem(i);
    saveToLocalStorage();
    showCards();
}


/**
 * This function is supposed to splice a specific item out of all arrays
 * 
 * @param {number} i - Index of spliced item
 */
function spliceItem(i) {
    definitions.splice(i, 1);
    urls.splice(i, 1);
    characters.splice(i, 1)
}


/**
 * This function is used to read the value of the Input
 * 
 * @returns {string} The value in lower case
 */
function inputValue() {
    let searchValue = document.getElementById('searchBar').value;
    searchValue = searchValue.toLowerCase();
    return searchValue;
}


/**
 * This function is used to filter all cards and show only specified Cards
 */
function filter() {
    clearContent();
    createAddCard();

    if (inputValue()) {
        drawFilteredCards()
    } else {
        showCards();
    }
}


/**
 * This function is used to render the filtered Cards backwards
 */
function drawFilteredCards() {
    for (let i = definitions.length - 1; i >= 0; i--) {
        if (filterByDefinition(i)) {
            drawCard(i);
        } else if (filterBySpecie(i)) {
            drawCard(i);
        };
    }
}


/**
 * 
 * @param {number} i - Index of filtered card
 * @returns {boolean} If the search input is found in the definitions array at the specific index
 */
function filterByDefinition(i) {
    return definitions[i].toLowerCase().includes(inputValue())
}


/**
 * 
 * @param {number} i - Index of filtered card
 * @returns {boolean} If the search input is found in the characters array at the specific index
 */
function filterBySpecie(i) {
    return characters[i].toLowerCase().includes(inputValue())
}


////////// HTML /////////////////


function newCardHtml(url, definition, size, character, i) {
    return `
        <div class='card' id='card${i}'>
            <img class='close-img' src='img/close_x.png' onclick='deleteCard(${i})'>
            <img style="width: ${size}px; height: ${size}px" class='image' src='${url}'>
            <div class='card-description'>
                <span class='definition'>${definition}</span>
                <span id='character${i}' class='character-name'>#${character}</span>
            </div>
        </div>
    `;
}


function addingCardHtml() {
    return `
        <div class='card' onclick='openInputDiv()'>
            <div class="input-div d-none" id="inputDiv">
                <input class="name-input" type="text" id="definition" placeholder='name'>
                <div class="dropdown">
                    <button class="dropbtn">Character</button>
                    <div class="dropdown-content">
                        <a onclick="createCard('Roboter'); event.stopPropagation()">Roboter</a>
                        <a onclick="createCard('Monster'); event.stopPropagation()">Monster</a>
                        <a onclick="createCard('Katze'); event.stopPropagation()">Katze</a>
                    </div>
                </div>
            </div>
            <img id="plusImg" class='plus-img' src='img/plus_black.png'>
        </div>
    `;
}



