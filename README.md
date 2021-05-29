PAGES: https://percio.gitlab.io/connect-four 


Dev Team: Senyce White, Chris Stranger, Steven Delpercio
Cite : 
Conor Bailey, a developer that gave me the idea to use a table , rather than stressing over flex containers. A portion of our code is inspired by his logic for looping over tables. 
His logic also forced us to research, and understand some concepts that we have not been tought. 
Randy Cox- gave us the architecture for winning conditions and what potential functions would be necessary to make this work. This was a great jumping of point.


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


Resources I needed to really needed to understand better: 

Template Literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
Callback Functions: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function
Tables: https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics
prototype.call: https://www.youtube.com/watch?v=CCb96W92A54
forEach loops: https://www.youtube.com/watch?v=159EAISAxwg
