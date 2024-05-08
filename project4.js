'use strict';

// GLOBALS
// initalizing api data vars
let imgUrl1;
let imgUrl2;
let fact1;
let fact2; 
// i is used to track how many times the user reaches the limit
let i = 1;
// grabbing form data
let form = document.forms.options;
let catOrDog = form.catDog.value;
let wordLength = form.totalWords.value;
let textArea = document.querySelector('#userWords');
let img = document.getElementById('image');
let fact = document.getElementById('funFact');

// ---------------------------------------------------------------------------
// API 
// ---------------------------------------------------------------------------
// Dog Images: https://dog.ceo/api/breeds/image/random
// Dog Facts: https://dog-api.kinduff.com/api/facts?number=1
// Cat Images: https://api.thecatapi.com/v1/images/search
// Cat Facts: https://catfact.ninja/fact
async function preLoad() {
    // await - allows us to structure the order code runs
    // ---------------------------------------------------------
    // CAT IMAGE API
    const urlCatImg = 'https://api.thecatapi.com/v1/images/search';
    const options1 = {
        method: 'GET',
        headers: {
            'x-api-key': 'live_AwSaABa0QNTSG2gl3zFvVLzZgU4uxqi6MHaenFVM5pL7qW9ERLce3lLv67FNGiDG'
        }
    };
    const response = await fetch(urlCatImg, options1);
    if (response.ok) {
        const data = await response.json();
        imgUrl1 = data[0].url;
    } else {
        console.log('no cat img for u :(');
    }

    // ---------------------------------------------------------
    // CAT FACT API
    const urlCatFact = 'https://catfact.ninja/fact';
    const response2 = await fetch(urlCatFact, options1);
    if (response2.ok) {
        const data = await response2.json();
        fact1 = data['fact'];
    } else {
        console.log('no cat fact for u :(');
    }

    // ---------------------------------------------------------
    // DOG FACT API
    const urlDogFact = 'https://dogapi.dog/api/v2/facts?number=1';
    const options = {
        method: 'GET'
    };
    const response3 = await fetch(urlDogFact, options);
    if (response3.ok) {
        const data = await response3.json();
        fact2 = data['data'][0]['attributes']['body'];
    } else {
        console.log('no dog fact for u :(');
    }
    
    // ---------------------------------------------------------
    // DOG IMAGE API
    const urlDogImg = 'https://dog.ceo/api/breeds/image/random';
    const response4 = await fetch(urlDogImg, options);
    if (response4.ok) {
        const data = await response4.json();
        imgUrl2 = data['message'];
    } else {
        console.log('no dog img for u :(');
    }
}


// ---------------------------------------------------------------------------
// CHECKING LENGTH AND DISPLAYING IMG/FACT
// ---------------------------------------------------------------------------
// checks length of textarea input whenever the user types
// splits by spaces to see how many words there are
// updates current count - displays on screen
// ALSO puts userData into local storage 
// and pulls it out accordingly
function checkLength(e) {
    // splits by spaces so we can seperate each word 
    // and also filters out words that are empty str/spaces
    let words = textArea.value.split(' ').filter(word => word.trim() !== '');

    document.querySelector('#currentCount').innerHTML = `Current Word Count: <strong>${words.length}</strong`;

    if (words.length >= (wordLength * i)) {
        i+=1;
        displayImgAndFact();
        return true
    } else {
        return false
    }
}


// displays img and fact, takes limit into account 
// bc new img/fact will need to be displayed if they're reached the limit more than once
function displayImgAndFact() {
    if (checkLength) {
        console.log('displaying image and fact....');
        if (form.catDog.value == '1') {
            img.src = imgUrl1;
            fact.innerHTML = fact1;
            if (i > 1) {
                preLoad();
                img.src = imgUrl1;
                fact.innerHTML = fact1;
            }
        } else {
            img.src = imgUrl2;
            fact.innerHTML = fact2;
            if (i > 1) {
                preLoad();
                img.src = imgUrl2;
                fact.innerHTML = fact2;
            }
        }
    } else {
        img.src = "images/ay.jpeg";

    }
}

// ---------------------------------------------------------------------------
// LOCAL STORAGE 
// ---------------------------------------------------------------------------
// updates data, directly puts it into local storage
// there is a bit of bugginess with how this works
// for ex.. when the page reloads, the count gets reset but it will reappear whenever the user
// starts typing again bc my checkLength function takes care of the word count. there is a bit
// of a disconnect between local storage and everything else bc of this
function updateData() {
    localStorage.setItem('userText', textArea.value);
}

// loads any exisitng data from local storage
function loadData() {
    let exisitingData = localStorage.getItem('userText');
    if (exisitingData) {
        textArea.value = exisitingData;
    }
}


// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(function init() {
    preLoad();
    // whenever form changes, update values
    form.addEventListener('change', (e) => {
        catOrDog = form.catDog.value;
        wordLength = form.totalWords.value;
    });
    // whenever user types, check length
    textArea.addEventListener("keyup", (e) => {
        checkLength(e);
        updateData();
    });
    // loads in user data from local storage when page loads
    window.addEventListener('load', loadData);
})();


// load an image and fact for a cat or dog
// interface - textarea input for typing
// use spaces to find words spacebar released aka keyup - then split by spaces.. n count em!
// list of words, compare your word count to the limit 
// based on result - might need a new img and fact
// 4 levels of words, 50 100 250 500
// keep track of current word count 