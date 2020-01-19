Feature: Set ships

  As a player,
  I want to set my warships on my sea.

  Background: Create game
    Given a new battleship match between player1 and player2 has been requested

  Scenario Outline: Ship types and their size
    When player1 sets a <ship type> to A1
    Then the ship occupies the fields <from> to <to>

  Examples:
    | ship type  | from | to |
    | carrier    | A1   | E1 |
    | battleship | A1   | D1 |
    | destroyer  | A1   | C1 |
    | submarine  | A1   | B1 |

  Scenario Outline: Number of ships per player
    Given player1 has set <count> <ship type>
    When player1 sets a <ship type>
    Then the ship is not set

  Examples:
    | ship type  | count |
    | carrier    | 1     |
    | battleship | 2     |
    | destroyer  | 3     |
    | submarine  | 4     |

  Scenario: Ships can be set vertically
    When player1 sets a battleship to A1 vertically
    Then the ship occupies the fields A1 to A4

  Scenario: Ships must not collide with each other
    Given player1 has set a battleship to A1
    When player1 sets a battleship to A2
    Then the ship is not set

  Scenario: Ships must not be set beyond the boarder
    When player1 sets a battleship to I1
    Then the ship is not set