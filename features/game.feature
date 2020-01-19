Feature: Game

  As a player I want to create a new battleship match.

  Scenario: Start game
    When a new battleship match between player1 and player2 is requested
    Then a new game is created