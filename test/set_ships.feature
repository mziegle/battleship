Feature: Set ships

  As a player,
  I want to set my warships on my sea.

  Scenario Outline: Ship types and their size
    When player A sets a <ship type> to A1
    Then the ship occupies the fields <from> to <to>

  Examples:
    | ship type  | from | to |
    | carrier    | A1   | E1 |
    | battleship | A1   | D3 |
    | destroyer  | A1   | C2 |
    | submarine  | A1   | B2 |
