\ grid is what the game looks like
\ 0 = empty
\ 1 = snake body


CREATE grid 100 ALLOT

\ snake-offset is the cell offset of the snake's head
\ snake-length is the number of cells in the snake
\ So to move the snake, we
\    note the old head's position
\    decrement snake-offset
\    use direction to calculate the new head's position
\    write the new head into snake+offset
\    all of this must treat the snake as a circular list

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
      160 I - I snake + C!  \ Set snake elements 93..97 to 1
    ELSE
      0 I snake + C!  \ Set all other elements to 0
    THEN
  LOOP
;

: init-game ( -- )
  clear-grid
  init-snake
  1 direction !
  ;  \ Start moving right

: snake-segment@ ( n -- n )
    snake-offset @ + 100 MOD snake + C@ ;

: current-head ( -- n )
    0 snake-segment@ ;

: set-new-head ( old-head -- )
    direction @ +  \ Add direction to get new head position
    100 + 100 MOD  \ Ensure it wraps around the grid
    snake-offset @ 1- 100 + 100 MOD snake-offset !  \ Decrement and wrap snake-offset
    snake-offset @ snake + C!  \ Store new head position in snake at the new offset
;

: move-snake ( -- )
  current-head
  set-new-head ;

: update-grid ( -- )
  clear-grid
  snake-length @ 0 DO
    I snake-segment@
    grid +                  \ Add address in the grid
    1 SWAP C!                \ Set that grid cell to 1
  LOOP ;

: tick ( -- )
  move-snake
  update-grid ;

: get-grid-address ( -- addr )
  grid ;

init-game





