Feature: Set ships

  As a player,
  I want to set my warships on my sea.

  Scenario: Set carrier
    When player A sets the carrier to A1
    Then the ship is on the fields A1 to E1

  Scenario: Set battleship
    When player A sets the battleship to A1
    Then the ship is on the fields A1 to D3

  Scenario: Set destroyer
    When player A sets the destroyer onto A1
    Then the ship is on the fields A1 to C2

  Scenario: Set submarine
    When player A sets the submarine onto A1
    Then the ship is on the fields A1 to B2