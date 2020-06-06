Feature: Game

  As a player,
  I want to be guided through the course of the game.

  Scenario: Create game
    When a new battleship match between player1 and player2 is requested
    Then a new game is created

  Scenario: Players are not finished with placing ships
    Given a new battleship match between player1 and player2 has been created
    And player1 has set a carrier to A1
    When the start of the game is requested
    Then the requestor receives an error message
      | type         | message                   |
      | Domain Error | Not all ships were placed |

  Scenario: Player fires although the game has not yet started
    Given a new battleship match between player1 and player2 has been created
    When player1 fires at A1 of player2s sea
    Then the requestor receives an error message
      | type         | message                           |
      | Domain Error | The game has not been started yet |

  Scenario: Players are finished with placing ships
    Given a new battleship match between player1 and player2 has been created
    And the players have set all their ships
    When the start of the game is requested
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