/*
  Memory Game - Modern Version
  A card matching game where players need to find pairs of matching cards.
*/

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const startButton = document.getElementById('start-button');
  const gameContainer = document.getElementById('game-container');
  const scoreSection = document.getElementById('score');
  const actionsSection = document.getElementById('actions');
  const headingSection = document.getElementById('heading');
  const moveCounterSection = document.getElementById('move-counter');
  const restartButton = document.querySelector('.restart');
  const moveCounterDisplay = document.querySelector('.move-counter');
  const scoreDisplay = document.querySelector('.score-text');

  // Game state variables
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let score = 0;
  let moveCounter = 0;
  
  // Card images
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

  // Start game button click event
  startButton.addEventListener('click', () => {
    // Show game elements
    gameContainer.style.display = 'flex';
    gameContainer.classList.add('active');
    scoreSection.style.display = 'block';
    moveCounterSection.style.display = 'block';
    actionsSection.style.display = 'block';
    
    // Apply some styling
    document.body.style.backgroundColor = '#f8f9fa';
    
    // Hide start elements
    startButton.style.display = 'none';
    headingSection.querySelector('h1').textContent = 'Memory Game';
    headingSection.querySelector('p').textContent = 'Find all matching pairs!';

    // Initialize the game board
    resetGame();
  });

  // Fisher-Yates shuffle algorithm
  function shuffle(array) {
    const newArray = [...array]; // Create a copy of the array
    let counter = newArray.length; 
    while (counter > 0) {
      const index = Math.floor(Math.random() * counter); 
      counter--;  
      [newArray[counter], newArray[index]] = [newArray[index], newArray[counter]];
    }  
    return newArray;
  }
  
  // Generate cards and add to the game container
  function generateCards() {   
    gameContainer.innerHTML = '';
    
    // Shuffle the images each time we generate cards
    let shuffledImages = shuffle(images);
    
    for (let image of shuffledImages) {
      // Create card element
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.image = image.imgSrc;
      
      // Add click event listener
      card.addEventListener('click', flipCard);
      
      // Add to game container
      gameContainer.appendChild(card);
    }
  }
  
  // Card flip function
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    // Flip the card
    this.classList.add('flip', 'animated-flip');
    this.style.backgroundImage = `url(${this.dataset.image})`;
    
    // Logic for first and second card selection
    if (!firstCard) {
      firstCard = this;
      return;
    }
    
    secondCard = this;
    moveCounter++;
    moveCounterDisplay.textContent = moveCounter;
    
    checkForMatch();
  }

  // Check if the flipped cards match
  function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
    
    // Game over check after exactly 9 moves
    if (moveCounter === 9) {
      setTimeout(() => handleGameOver(), 1000);
    }
  }

  // Handle matching cards
  function disableCards() {
    firstCard.style.backgroundImage = `url(${firstCard.dataset.image})`;
    secondCard.style.backgroundImage = `url(${secondCard.dataset.image})`;
    
    // Add matched class for styling
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    // Remove event listeners
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Celebrate match with animation
    firstCard.classList.add('celebrate');
    secondCard.classList.add('celebrate');
    
    // Remove celebration after animation ends
    setTimeout(() => {
      firstCard.classList.remove('celebrate');
      secondCard.classList.remove('celebrate');
    }, 500);
    
    // Update score
    score++;
    scoreDisplay.textContent = score;
    
    // Reset for next pair
    resetBoard();
    
    // Check for game win (all cards matched)
    const allCards = document.querySelectorAll('.card');
    const matchedCards = document.querySelectorAll('.matched');
    
    if (matchedCards.length === allCards.length) {
      setTimeout(showWinMessage, 1000);
    }
  }

  // Show win message
  function showWinMessage() {
    // If SweetAlert2 is loaded
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: 'Congratulations!',
        text: `You won the game in ${moveCounter} moves!`,
        icon: 'success',
        confirmButtonText: 'Play Again',
        confirmButtonColor: '#3e64ff'
      }).then((result) => {
        if (result.isConfirmed) {
          resetGame();
        }
      });
    } else {
      // Fallback if SweetAlert is not loaded
      alert(`Congratulations! You won the game in ${moveCounter} moves!`);
      resetGame();
    }
  }

  // Handle non-matching cards
  function unflipCards() {
    lockBoard = true;
    
    // Flip cards back after a delay
    setTimeout(() => {
      if (firstCard) {
        firstCard.classList.remove('flip', 'animated-flip');
        firstCard.style.backgroundImage = '';
      }
      
      if (secondCard) {
        secondCard.classList.remove('flip', 'animated-flip');
        secondCard.style.backgroundImage = '';
      }
      
      resetBoard();
    }, 1500);
  }

  // Handle game over
  function handleGameOver() {
    const matchedCards = document.querySelectorAll('.matched');
    const totalPairs = images.length / 2;
    
    if (matchedCards.length / 2 < totalPairs) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: 'Game Over',
          text: `You found ${matchedCards.length / 2} out of ${totalPairs} pairs. Try again?`,
          icon: 'error',
          confirmButtonText: 'Play Again',
          confirmButtonColor: '#3e64ff'
        }).then((result) => {
          if (result.isConfirmed) {
            resetGame();
          }
        });
      } else {
        // Fallback if SweetAlert is not loaded
        alert(`Game Over! You found ${matchedCards.length / 2} out of ${totalPairs} pairs.`);
        resetGame();
      }
    }
  }

  // Reset board after a turn
  function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  // Reset game completely
  function resetGame() {
    // Reset state variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    score = 0;
    moveCounter = 0;
    
    // Reset UI
    scoreDisplay.textContent = '0';
    moveCounterDisplay.textContent = '0';
    
    // Regenerate cards
    generateCards();
    
    return true;
  }

  // Restart button event listener
  restartButton.addEventListener('click', resetGame);

  // Initialize the cards on page load
  generateCards();

  // Add SweetAlert2 for win/lose messages
  if (typeof Swal === 'undefined') {
    const sweetalert = document.createElement('script');
    sweetalert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(sweetalert);
  }
}); 