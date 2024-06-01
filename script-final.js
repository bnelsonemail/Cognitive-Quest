
/*                  MEMORY GAME
    1. Create a game that has 6 cards
    2. Each card should have a back and front
    3. The front should display an image
    4. The back should be a solid color
    5. The cards should be shuffled
    6. The cards should flip when clicked
    7. If the cards match, they should stay flipped
    8. If the cards do not match, they should flip back over
    9. The game should end when all cards are matched
    10. The game should have a reset button
    11. The game should have a timer that starts when the game starts
    12. The game should display the time it took to complete the game
    13. The game should have a start button
    14. The game should have a win screen
    15. The game should have a lose screen
  
    Psuedo Code
    1. Create a start button
    2. Choose 5-10 images to use for your game
    3. Create an array that has each image listed twice so there are pairs
    4. Create a function to shuffle your array
    5. Create a function that will loop through your array of images and create divs for each image
    6. Add an event listener to the div that will flip the card
    7. Add a function to handle the flip
    8. Add a function to check for a match
    9. Add a function to handle a match
    10. Add a function to limit the number of turns to be 9 attempts.
    11. Add a function to display a win screen
    12. Add a function to display a lose screen
    13. Add a function to reset the board after a non-match
    14. Add a function to reset the board after a match
    15. Add a function to reset the game
    16. Add a function to initialize the game
    17. Call the initialize function
    18. Test your game!
*/
//                 Working Code

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const content = document.getElementById('game-container');
    const score = document.getElementById('score');
    const actions = document.getElementById('actions');
    const heading = document.getElementById('heading');
    const page = document.getElementById('page');
    const move = document.getElementById('move-counter');
  
    startButton.addEventListener('click', () => {
      // Reveal the content
      content.style.display = 'flex';
      content.style.flexWrap = 'wrap';
      /*content.style.justifyContent = 'center';
      content.style.alignItems = 'center';*/
      content.style.gap = '1rem';  // For some reason this was not being recognized in CSS.  So I placeed it in JS to get the desired results.
      //content.style.flex = '1 0 25%';

      /*content.style.gridTemplateColumns = 'repeat(6, 140px)';
      content.style.gridTemplateRows = 'repeat(2, calc(140px / 2 * 3))';
      content.style.perspective = '1000px';*/
      
      page.style.backgroundColor = '#3c14de';

      score.style.display = 'flex';
      score.style.justifyContent = 'center';
      score.style.alignItems = 'center';
      score.style.fontFamily = 'cursive';
      score.style.fontSize = '5rem';

      move.style.display = 'flex';
      move.style.justifyContent = 'center';
      move.style.alignItems = 'start';
      move.style.fontFamily = 'cursive';
      move.style.fontSize = '5rem';

      actions.style.display = 'flex';
      actions.style.justifyContent = 'center';
      actions.style.alignItems = 'center';
  
      // Optionally, you can hide the start button after clicking
      startButton.style.display = 'none';
      heading.style.display = 'none';
    });
  });
    // Add an initialize game function
function startGame() {
    return resetGame();
}

// 2. Choose 5-10 images to use for your game

const gameContainer = document.getElementById("game-container");
const images = [
    {imgSrc: 'images/img1.jpg', name: 'img1'},
    {imgSrc: 'images/img1.jpg', name: 'img1'},
    {imgSrc: 'images/img2.jpg', name: 'img2'},
    {imgSrc: 'images/img2.jpg', name: 'img2'},
    {imgSrc: 'images/img3.jpg', name: 'img3'},
    {imgSrc: 'images/img3.jpg', name: 'img3'},
    {imgSrc: 'images/img4.jpg', name: 'img4'},
    {imgSrc: 'images/img4.jpg', name: 'img4'},
    {imgSrc: 'images/img5.jpg', name: 'img5'},
    {imgSrc: 'images/img5.jpg', name: 'img5'},
    {imgSrc: 'images/img6.jpg', name: 'img6'},
    {imgSrc: 'images/img6.jpg', name: 'img6'},
];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let score = 0;
let moveCounter = 0;


//document.querySelector('.score').textContent = score;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
    let counter = array.length; 
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter); 
      // Decrease counter by 1
      counter--;  
      // And swap the last element with it
      let temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }  
    return array;
  }
  
  let shuffledImages = shuffle(images);
 

  //  1st attempt
  function generateCards() {   
    for (let image of shuffledImages) {
        // create a new div
        const card = document.createElement("div");
        // give it a class of card  (this will style your div)  (this is the front of the card)     
        card.classList.add("card");
        // set the data-name attribute of the div to the array's value
        card.dataset.image = image.imgSrc;
        // append the div to the element with an id of gameContainer
        gameContainer.appendChild(card);
        card.addEventListener('click', function (){

            
            if (lockBoard) return;
            if (this === firstCard) return;
            this.classList.add('flip');
            this.style.backgroundImage = `url(${this.dataset.image})`;
            if (!firstCard) {
                firstCard = this;
                return;
            }
            secondCard = this;
            checkForMatch();
        });
                
    }
    }
    generateCards();


function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
    updateMoveCounter();
};


function disableCards() {
    firstCard.style.backgroundImage = `url(${firstCard.dataset.image})`;
    secondCard.style.backgroundImage = `url(${secondCard.dataset.image})`;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    score++;
    document.querySelector('.score-text').textContent = score;
    resetBoard();
};


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    score++;
    
    document.querySelector('.score-text').textContent = score;
    
    lockBoard = true;
    checkForMatch();
}


function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        if(firstCard.classList.contains("flip")){
            firstCard.classList.remove('flip');};
        if(secondCard.classList.contains("flip")){
            secondCard.classList.remove('flip');}
        firstCard.style.backgroundImage = "";
        secondCard.style.backgroundImage = "";
        resetBoard();
    }, 1500);
};



function updateMoveCounter (){
       if (firstCard != secondCard){
            moveCounter++
       };

       if (moveCounter === 9){
           handleGameOver();
       };

    document.querySelector('.move-counter').textContent = moveCounter;
    const allCards = document.querySelectorAll('.card');
    const matchedCards = document.querySelectorAll('.flip');
    
    if (allCards.length === matchedCards.length) {
        // Game is won
        
        alert("Congratulations! You won the game!");
        moveCounter = 0;
        document.querySelector('.move-counter').textContent = moveCounter;
        resetBoard();
        resetGame();
        
    };
    }



function handleGameOver() {
    // Check if all cards are matched
    const allCards = document.querySelectorAll('.card');
    const matchedCards = document.querySelectorAll('.flip');
    if (allCards.length !== matchedCards.length) {
        // Game is lost
        alert("Game over! You lost the game! Better luck next time!");
        resetBoard();
        resetGame();
    }
    
}



function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    
};


function resetGame() {
    gameContainer.innerHTML = '';
    shuffledImages = shuffle(images);
    generateCards();
    score = 0;
    moveCounter = 0;
    document.querySelector('.score-text').textContent = score;
};



const restartButton = document.querySelector('.restart');
restartButton.addEventListener('click', function() {
    resetGame();
    });


