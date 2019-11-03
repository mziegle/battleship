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

  Scenario Outline: Number of ships per player
    Given player A has set <count> <ship type>
    When player A sets a <ship type>
    Then the ship is not set

  Examples:
    | ship type  | count |
    | carrier    | 1     |
    | battleship | 2     |
    | destroyer  | 3     |
    | submarine  | 4     |

  Scenario: Ships can be set vertically
    When player A sets a battleship to A1 vertically
    Then the ship occupies the fields from A1 to A3

  Scenario: Ships must not collide with each other
    Given player A has set a battleship to A1
    When player A sets a battleship to A2
    Then the ship is not set

  Scenario: Ships must not be set beyond the boarder
    When player A sets a battleship to I1
    Then the ship is not set
