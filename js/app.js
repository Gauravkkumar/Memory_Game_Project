/*
 * Create a list that holds all of your cards
 */

 const imageToShuffle = ["fa-hand-spock", "fa-hand-spock", "fa-space-shuttle", "fa-space-shuttle", "fa-film", "fa-film", "fa-globe", "fa-globe", "fa-map", "fa-map", "fa-eject", "fa-eject", "fa-paper-plane", "fa-paper-plane", "fa-star", "fa-star"];
 const cards = Array.from(document.getElementsByClassName('card'));
 let firstCard;
 let symbol1;
 let symbol2;
 let click = 0;
 let move = 0;
 let startingTime;
 let endingTime;
 const game = document.querySelector('.container');
 const popUp = document.querySelector('.alert');
 let preventClick = false;
 let tickID;


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffleCards(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    console.log(array);
    return array;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function loadGame() {
    let mixImages = shuffleCards(imageToShuffle);
    let eachI = Array.from(document.querySelectorAll('ul.deck > li > i.fas'));
    eachI.forEach(function(i, index) {
        let oneSymbol = mixImages[index];
        i.className = "fas " + oneSymbol;;
    })
}


// to load of the game page
loadGame();


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
cards.forEach(function(card, index) {
     card.addEventListener('click', onCardClicked);
});

const playAgain = document.querySelector('button');
const restart = document.querySelector('.restart');
restart.addEventListener('click', function(){
    console.log('restart game');
    location.reload();
})
playAgain.addEventListener('click', function() {
    console.log('want to play again');
    setTimeout( function() {
        location.reload();
    }, 200);
})

function onCardClicked(event) {
    const card = event.target;
    if (card.className !== 'card') {
        return;
    }
    if (preventClick) {
        return;
    }
    card.classList.add("shown-card");
    click++;
    if (click === 1) {
        startingTime = performance.now();
        tickID = setInterval(tick, 1000);
    }
    maybeMatch(card);
}

//does the cards match ?
function maybeMatch (card) {
    if (click % 2 === 0){
        incrementMove();
        changeScore();
        symbol2 = card.children[0].className;
        if (symbol1 === symbol2){
            console.log('you find it');
            maybeEndGame(card);
        } else {
            preventClick = true;
            console.log('try again');
            setTimeout(function(){
                card.classList.remove("shown-card");
                firstCard.classList.remove("shown-card");
                preventClick = false;
            }, 500);
        }
    } else {
        symbol1 = card.children[0].className;
        firstCard = card;
    }
}

// count of the number of player's moves
function incrementMove() {
    move++;
    let movesSpan = document.querySelector('.moves');
    movesSpan.innerHTML = move + " Moves";
}

// change of the stars score depending of the moves
function changeScore() {
    const scoreStar = document.querySelectorAll('div.score > ul.stars > li > i');
    applyStarNumber(scoreStar);
}

function applyStarNumber (starElements) {
    if (move > 14 && starElements[2].classList.contains("fas")) {

        starElements[2].classList.remove("fas");
        starElements[2].classList.add("far");
    }
    if (move > 19 && starElements[1].classList.contains("fas")) {

        starElements[1].classList.remove("fas");
        starElements[1].classList.add("far");
    }
}

// popup of end game
function maybeEndGame(card) {
    let faceCard = document.getElementsByClassName('shown-card');
    if (faceCard.length === 16) {
        clearInterval(tickID);
        endingTime = performance.now();
        changeTimer(endingTime);
        setTimeout(function(){
            let gameTimer = ("It took you " + ((endingTime - startingTime)/1000).toFixed(0) + "s to finish the game.");
            let timer = document.querySelector('.timer');
            const endGameStars = document.querySelectorAll('div.alert > ul.stars >li >i');
            applyStarNumber(endGameStars);
            timer.textContent = gameTimer;
            popUp.classList.add("win-game");
            game.classList.add('background-win');
        }, 1050);
    }
}

// chronometre
function tick() {
    changeTimer(performance.now());
}

function changeTimer(time) {
    const chrono = document.querySelector('.chrono');
    chrono.innerHTML = ((time - startingTime)/1000).toFixed(0) + " seconds";
}
