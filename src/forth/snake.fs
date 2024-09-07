
\ snake-offset is the cell offset of the snake's head
\ snake-length is the number of cells in the snake
\ So to move the snake, we
\    note the old head's position
\    decrement snake-offset
\    use direction to calculate the new head's position
\    write the new head into snake+offset
\    all of this must treat the snake as a circular list

CREATE gamestate 101 ALLOT
gamestate 1 + CONSTANT grid
gamestate CONSTANT game-over
VARIABLE snake-length
VARIABLE snake-offset 
CREATE snake 100 ALLOT  \ Each byte is a position on the grid as 10x + y
VARIABLE direction

: direction! ( n -- )
    DUP direction @ NEGATE = IF
        DROP  \ ignore because you can't go back on yourself
    ELSE
        direction ! 
    THEN ;

: >= ( n1 n2 -- f )
    < INVERT ;

: <= ( n1 n2 -- f )
    > INVERT ;

: shar ( addr len -- )
    0 DO
        DUP I + C@  \ Fetch the value at each cell
        .                \ Print the value
        I 1+ 10 MOD 0= IF CR THEN  \ Add a CR every 10 items
    LOOP
    DROP CR CR ;

: clear-grid ( -- )
  100 0 DO 0 I grid + ! LOOP ;

: init-snake ( -- )
  5 snake-length !  \ Set snake length to 5
  93 snake-offset !  \ Set snake offset to 93
  100 0 DO
    I 93 >= I 97 <= AND IF
      156 I - I snake + C!  \ Set snake elements 93..97 
    ELSE
      0 I snake + C!  \ Set all other elements to 0
    THEN
  LOOP
;

: init-game ( -- )
  clear-grid
  init-snake
  FALSE game-over !
  1 direction !
  ;  \ Start moving right

: snake-segment@ ( n -- n )
    snake-offset @ + 100 MOD snake + C@
;

: current-head ( -- n )
    0 snake-segment@
;

: top-edge? ( oldpos newpos -- f )
   100 >=
   NIP 
;

: bottom-edge? ( oldpos newpos -- f )
    0 < 
    NIP
;

: side-edge? ( oldpos newpos -- f )
    2DUP - ABS 1 > IF
      DROP DROP FALSE \ changing rows is only an edge on a sideways move
    ELSE
      10 / SWAP 10 / \ get rows
      <>    \ are we on the same row?
    THEN
;


: edge? ( oldpos newpos -- f ) 
    2DUP top-edge? ROT ROT
    2DUP bottom-edge? ROT ROT 
    side-edge? 
    OR OR
;

: snake-shift ( -- )
  snake-offset @ 1- 
  100 + 100 MOD 
  snake-offset !  \ Decrement and wrap snake-offset
;

: set-new-head ( old-head -- )
    DUP 
    direction @ +  \ Add direction to get new head position
    2DUP edge? IF
       ." Game over! "
       1 game-over C!
       gamestate 101 shar
       DROP DROP
    ELSE
       NIP
       snake-shift
       snake-offset @ snake + C!  \ Store new head position in snake at the new offset
    THEN
;

: move-snake ( -- )
  current-head
  set-new-head ;

: update-grid ( -- )
  clear-grid
  snake-length @ 0 DO
    I snake-segment@
    grid +      \ Add address in the grid
    1 SWAP C!   \ Set that grid cell to 1
  LOOP ;

: tick ( -- )
  move-snake
  update-grid ;

: get-state-address ( -- addr )
  gamestate ;

init-game





