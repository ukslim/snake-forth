# snake-forth

I went to the Micro Museum in Ramsgate. Although most of the old computers there were being used for games, I spotted the packaging
for Acornsoft Forth, for the Electron, in a display case, and that got me wondering about Forth.

To cut a long story short, I ended up attempting to write Snake in Forth. And I asked an LLM to help me.

To keep myself sane, IO is via the browser, with Typescript rendering the game state to an HTML Canvas. The game logic, though, is all Forth,
run via WebAssembly using [WAForth](https://github.com/remko/waforth)

We have a snake that moves around a board.

`$ npm start` runs it. Or it's on github pages -- find the link on the github project page.

TODO - and I in no way promise to get around to any of these:

   - game over if you leave the board (no more warping)
   - apples and snake-growing
   - presentational niceties
     
