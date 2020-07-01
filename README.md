PAGES:


Dev Team: Senyce White, Chris Stranger, Steven Delpercio
Cite : 
@conorbailey, a developer that gave me the idea to use a grid, rather than stressing over flex containers. Some of the logic in our game comes from his discription of how to complete this concept.  -Steven
Button was made with https://www.bestcssbuttongenerator.com/  -Steven

1. Create board layout
- make flex container
- add styling
- conditional for not letting column over fill (.childElementCount)

2. Allow team chips to be moved.
- setup onclick funtion ( .addEventListener('click, function))
- Drop function
- check for winning condition/ if none proceed to step 3

3. Conditional to switch players
- upon .onclick completion change chip color/player

4. set up winning conditionals
- check for 4 in a row in every direction (column "assending/decending??", row, diagionally)
- notify winner... somehow 
- OR notify of stalemate 




Steven 7/1/20 Update.

1.Board layout... So after several hours of messing with flex containers, and doing research.. I decided to go the route of just making a grid using a table... So this board is essentially just a big, styled table. This pours over into How we will utilize the game logic. This elimiated the need for .childElementCount because there is literally only a finite amount of space that can be filled, over filling isnt really an option. also, Instead of throwing every piece in a div, we can style each box in the grid on a click and use it to make the game.

2. chips no longer exist(who needs them anyway?), what does exsit is an array of table data, and that data changes color based on its position in that array. So no need to move anything around.

3. there is a statment in the end of the for loop that changes the player

4. winning conditions are set, but because of the way I set up the grid, what it does is checks the text color of every square, and says if there are 4 in a row you win, and it checks every direction based on the total possible oppotunites to win in that direction (which is how I chose the numbers for my for loops). I want to make 1 single function that checks all winners eventually but I just hard coded it using || and seperate functions for now to prove it works.

Resources I needed to really needed to understand better: 

Template Literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
Callback Functions: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function
Tables: https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics
prototype.call: https://www.youtube.com/watch?v=CCb96W92A54
forEach loops: https://www.youtube.com/watch?v=159EAISAxwg
