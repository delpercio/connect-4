PAGES:

1. Create board layout
- make flex container
- add styling
- conditional for not letting column over fill (.childElementCount)

2. Allow team chips to be moved.
- setup onclick funtion ( -columnEl.addeventListener('click'), columnClickHandler
- Drop function
- check for winning condition/ if none proceed to step 3

3. Conditional to switch players
- upon .onclick completion change chip color/player

4. set up winning conditionals
- check for 4 in a row in every direction (column "assending/decending??", row, diagionally)
- notify winner... somehow 
- OR notify of stalemate 

Minimun Viable Product(MVP)

<!-- 
1. Initialize the game
    -players
    -board display
    -board model
    -current player tracker
    -click handlers for each column
2. Take player input
    -know which player is dropping disc
    -know which column being dropped into
    -know if column is already full
    -drop the disc into top of column
3. check for the game end conditions
    -tie
    -win
    -announce end of game -->