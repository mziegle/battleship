Feature: Fire

  As a player,
  I want to fire at my opponents sea.

  Background: Prepare game
    Given player1 has been registered
    And player2 has been registered
    And both players have placed their ships as follows
      | from | to | ship       |
      | A1   | E1 | carrier    |
      | A3   | D3 | battleship |
      | A5   | D5 | battleship |
      | A7   | D7 | destroyer  |
      | A9   | D9 | destroyer  |
      | G1   | I1 | destroyer  |
      | G3   | H3 | submarine  |
      | G5   | H5 | submarine  |
      | G7   | H7 | submarine  |
      | G9   | H9 | submarine  |
    And a match between player1 and player2 has been started

  Scenario: Ship is missed
    When player1 fires at A2 of player2s sea
    Then only water is hit
 
  Scenario: Ship is hit
    When player1 fires at A1 of player2s sea
    Then the ship is hit

  Scenario: Ship is hit on all parts
    Given player1 has fired at the following areas of player2s sea
      | field |
      | A1    |
      | B1    |
      | C1    |
      | D1    |
    When player1 fires at E1 of player2s sea
    Then the ship is sunk