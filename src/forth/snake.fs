
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
VARIABLE apple
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
  0 snake-offset !  \ Set snake offset to 0
  100 0 DO
    I 0 >= I 4 <= AND IF
      63 I - I snake + C!  \ Set snake elements 0..4 to coords 6,3 6,4 6,5 6,6 6,7
    ELSE
      0 I snake + C!  \ Set all other elements to 0
    THEN
  LOOP
;

: snake-segment@ ( n -- n )
    snake-offset @ + 100 MOD snake + C@
;

: current-head@ ( -- n )
    0 snake-segment@
;

: is-snake ( n -- f )
  FALSE
  snake-length @ 0 DO
    OVER I snake-segment@ =
    IF
      DROP TRUE
      LEAVE
    THEN
  LOOP
  NIP
;

: tangled? ( -- f )
  current-head@
  FALSE
  snake-length @ 1 DO
    OVER I snake-segment@ =
    IF
       DROP TRUE
       LEAVE
    THEN
  LOOP
  NIP
;

: init-apple ( -- )
  BEGIN
    RANDOM 100 MOD
    DUP is-snake 0=
  UNTIL
  apple C! ;

: init-game ( -- )
  clear-grid
  init-snake
  init-apple
  FALSE game-over !
  1 direction !  \ Start moving right
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
    2DUP 
    - ABS 1 > IF
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
       DROP DROP
    ELSE
       NIP
       snake-shift
       snake-offset @ snake + C!  \ Store new head position in snake at the new offset
    THEN
    snake-length @ 1 DO
       current-head@
       I snake-segment@
      = IF
            1 game-over C!
            LEAVE
       THEN
    LOOP
;

: eaten-apple? ( -- f )
  current-head@ apple @ =
;

: grow-if-eaten ( -- )
  eaten-apple? IF
    snake-length @ 1+ snake-length !
    init-apple
  THEN
;

: die-if-tangled ( -- )
  tangled? IF
    1 game-over C!
  THEN
;

: move-snake ( -- )
  current-head@
  set-new-head 
  grow-if-eaten
;

: update-grid ( -- )
  clear-grid
  2 apple @ grid + C!
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

: score? ( -- )
   snake-length @ 5 - 
;

init-game





