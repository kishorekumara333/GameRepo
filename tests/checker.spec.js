//@ts-check
const  { test, expect } = require('@playwright/test');

test.describe('Checker Game Tests', () => {

// Function to check if the site is up
async function checkSiteUp(page) {
  // Check the title and label of the page
  await expect(page).toHaveTitle('Checkers - Games for the Brain'); 
  // Check that the board is visible
  await expect(page.locator('#board')).toBeVisible(); 
  // Check that the links are visible
  await expect(page.getByRole('link', { name: 'Restart' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Rules' })).toBeVisible();
}

// Function to get the square element based on row and column
async function square(page, row, col) {
  return page.locator(`#board .line:nth-of-type(${row}) img:nth-of-type(${col})`);
}

// Wait until the game is ready for the next move
async function waitForMoveReady(page, ...coords) {
  const message = await page.locator('#message').textContent();
  if (message !== 'Make a move.') {
   if(message.includes('Click on your orange piece')) {
      await (await square(page, coords[0], coords[1])).click();
      await (await square(page, coords[2], coords[3])).click();
   }    
    return waitForMoveReady(page);
  }
  await expect(page.locator('#message')).toHaveText('Make a move.', { timeout: 5000 });
}

// Function to perform a step in the game 
async function step(page, ...options) {

  // Click on the first square and then the second square
  await (await square(page, options[0], options[1])).click();
  await (await square(page, options[2], options[3])).click();
  let eleSquare = await square(page, options[0], options[1]);
  let src = await eleSquare.getAttribute('src');
  if (!src || !src.includes('gray')) {
    // If not gray, try again (e.g., reselect)
     await (await square(page, options[0], options[1])).click();
     await (await square(page, options[2], options[3])).click();
  }
    await expect(await square(page, options[0], options[1])).toHaveAttribute('src', /gray/);
}
  test('Play game with five moves', async ({page}) => {   
   
    // Navigate to the Checker game page
    await page.goto('https://www.gamesforthebrain.com/game/checkers/'); 

    //  Confirm that the site is up - Verify the page is loaded with title,links and board with pieces
    await checkSiteUp(page);
    
    // Play five moves

    // Move 1: Click on the piece at (row,column) - (6, 8) and move it to (5, 7)
    await step(page,6,8,5,7);
    await waitForMoveReady(page,6,8,5,7);

    // Move 2: Click on the piece at (row,column) - (7, 7) and move it to (6, 8)
    await step(page,7,7,6,8);
    await waitForMoveReady(page,7,7,6,8);

    // Move 3: Click on the piece at (5, 7) and move it to (3, 5)
    await step(page,5,7,3,5);   
    await waitForMoveReady(page,5,7,3,5);

    // Move 4: Click on the piece at (8, 8) and move it to (7, 7)
    await step(page,8,8,7,7);
    await waitForMoveReady(page,8,8,7,7);

    // Move 5: Click on the piece at (6, 2) and move it to (5, 1)
    await step(page,6,2,5,1);
    await waitForMoveReady(page,6,2,5,1);

    // Restart the game
    await page.getByRole('link', { name: 'Restart' }).click();

    // check the restart is successful
    await checkSiteUp(page);
  
  });   

});


