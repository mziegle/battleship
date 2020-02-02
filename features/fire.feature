Feature: Fire

  As a player,
  I want to fire at my opponents sea.

  Background: Set ships
    Given a new battleship match between player1 and player2 has been created
    And both players have placed their ships as follows
      | from | to | ship       |
      | A1   | E1 | Carrier    |
      | A3   | D3 | Battleship |
      | A5   | D5 | Battleship |
      | A7   | D7 | Destoyer   |
      | A9   | D9 | Destoyer   |
      | G1   | I1 | Destoyer   |
      | G3   | H3 | Submarine  |
      | G5   | H5 | Submarine  |
      | G7   | H7 | Submarine  |
      | G9   | H9 | Submarine  |
    And the match has been started

  @skip
  Scenario: Ship is missed
    When player1 fires at A2
    Then only water is hit

  @skip
  Scenario: Ship is hit
    When player1 fires at A1
    Then the ship is hit

  @skip
  Scenario: Ship is hit on all parts
    Given player1 has fired at A1, B1, C1 and D1
    When player1 fires at E1
    Then the ship is sunk