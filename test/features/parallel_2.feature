Feature: Cucumber Parallel Set Two

  In order to have the quick regression with Cucumber
  Fred, a cucumber user
  Wants to run Cucumber Scenarios in Parallel using cucumber-parallel module

  @happy
  Scenario: Fred runs scenarios in parallel
    Given Fred has multiple scenarios written in cucumber
    When he runs the features in parallel with "--parallel scenarios" using cucumber-parallel module
    Then all the scenarios should run in parallel

  @dataTable
  Scenario: Fred runs scenarios in parallel with data-tables
    Given Fred has a step with below data table
      | id | name   |
      | 1  | data-A |
      | 2  | data-B |
    When he runs the features in parallel with "--parallel features" using cucumber-parallel module
    Then all the scenarios should run in parallel

  @scenarioOutline
  Scenario Outline: Fred runs scenarios in parallel with scenario outline
    Given Fred has scenario outline with the "<id>"
    When he runs the features in parallel with "--parallel scenarios" using cucumber-parallel module
    Then all the scenarios should run in parallel

    Scenarios:
      | id |
      | 1  |
      | 2  |
