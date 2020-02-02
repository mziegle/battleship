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
      | type        | message                   |
      | State Error | Not all ships were placed |
    And the details show the ships left to be placed
      """
        {
          "player1": {
            "Battleship": 2,
            "Destroyer": 3,
            "Submarine": 4
          },
          "player2": {
            "Carrier": 1,
            "Battleship": 2,
            "Destroyer": 3,
            "Submarine": 4
          }
        }
      """

  @skip
  Scenario: Player fires although the game has not yet started
    Given a new battleship match between player1 and player2 has been created
    When player1 requests fire at A1
    Then the requestor receives an error message
      | error       | message                           |
      | Bad Request | The game has not been started yet |

  @skip
  Scenario: Players are finished with placing ships
    Given a new battleship match between player1 and player2 has been created
    And the players have set all their ships
    When the start of the game is requested
    Then the game is started
  
  @skip
  Scenario: A players last ship was sunk
    Given player1 and player2 have started a game
    When player1 sunk the last ship of player 2
    Then player1 wins