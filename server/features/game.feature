Feature: Game

  As a player,
  I want to be guided through the course of the game.

  Scenario: Player is ready
    Given player1 has been registered
    And player1 has placed all its ships
    When player1 creates a new game
    Then the game is created
  
  Scenario: An other player joins the game
    Given player1 has been registered
    And player1 has placed all its ships
    And player1 has created a game
    And player2 has been registered
    And player2 has placed all its ships
    When player2 joins the game
    Then the game is started

  Scenario: Player hits water
    Given player1 and player2 have started a game
    When player1 hits water
    Then it is player2s turn

  Scenario: Player hits a ship
    Given player1 and player2 have started a game
    When player1 hits a ship
    Then player1 is allowed to fire again

  Scenario: Player sunk a ship
    Given player1 and player2 have started a game
    When player1 sinks a ship
    Then it is player2s turn

  Scenario: A players last ship was sunk
    Given player1 and player2 have started a game
    When player1 sunk the last ship of player2
    Then player1 wins