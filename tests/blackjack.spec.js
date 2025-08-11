//@ts-check
const  { test, expect } = require('@playwright/test');

test.describe('Blackjack Game Tests', () => {

  // Function to check if the site is up
  async function checkSiteUp(page) {
    // Check the title and label of the page
    await expect(page).toHaveTitle('Deck of Cards API'); 
  }

// Function to draw cards and check if they form a blackjack
async function drawAndCheckBlackjack(page, deckId) {
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`;
  const response = await page.request.get(url);
  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.cards.length).toBe(3);

  const blackjackValues = ["10", "JACK", "QUEEN", "KING", "ACE"];
  const isBlackjack = data.cards.every(card => blackjackValues.includes(card.value));
  return isBlackjack;
}

// Function to check if any player has a blackjack
async function anyBlackJack(isBlackjackPlayer1, isBlackjackPlayer2) {

  if (isBlackjackPlayer1 && isBlackjackPlayer2) {
      console.log("Both players have a blackjack!");
    }
    else if (isBlackjackPlayer1) {
      console.log("Player 1 has a blackjack!");
    } else if (isBlackjackPlayer2) {
      console.log("Player 2 has a blackjack!");
    } else {
      console.log("No player has a blackjack.");
    }
}

  test('Verify if a person won a blackjack', async ({page}) => {   
   
    // Navigate to the Blackjack game api page
    await page.goto('https://deckofcardsapi.com/'); 

    //  Confirm that the site is up - Verify the page is loaded with title,links and board with pieces
    await checkSiteUp(page);

    // Make a request to the API to get a new deck
    const url = 'https://deckofcardsapi.com';
    const response = await page.request.get(`${url}/api/deck/new/shuffle/?deck_count=1`);
    const data = await response.json(); 
    const deckId = data.deck_id;
    expect(data.success).toBe(true);

    // Shuffle the deck
    const shuffleResponse = await page.request.get(`${url}/api/deck/${deckId}/shuffle/`);
    const shuffleData = await shuffleResponse.json(); 
    expect(shuffleData.success).toBe(true);
    expect(shuffleData.deck_id).toBe(deckId);
    

    // Draw three cards for the player1
    let isBlackjackPlayer1 = await drawAndCheckBlackjack(page, deckId);

    // Draw three cards for the player2
    let isBlackjackPlayer2 = await drawAndCheckBlackjack(page, deckId);
    
    // Check if both players have a blackjack
    await anyBlackJack(isBlackjackPlayer1, isBlackjackPlayer2);
     
  
  });   

});




function anyBlackJack(isBlackjackPlayer1, isBlackjackPlayer2) {
  throw new Error('Function not implemented.');
}

