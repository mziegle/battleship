Feature: Player

  As a player,
  I want to register and prepare my battelship games.

  Scenario: New player
    When a new player registers with the name player1
    Then the player is added

  Scenario: New player uses existing name
    Given the name player1 is already used
    When a new player registers with the name player1
    Then the player receives an error message
      | type         | message                          |
      | Domain Error | The name player1 is already used |