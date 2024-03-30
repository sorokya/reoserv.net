# Contributing to Reoserv

Thank you for your interest in contributing to the [Reoserv][reoserv.net]
project! We appreciate your efforts and welcome contributions from the
community. To ensure a smooth collaboration process, please follow these
guidelines:

## Code of Conduct

By participating in this project, you are expected to uphold our
[Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

1. Fork the [reoserv.net repository][reoserv.net] and create a new branch for
   your contribution.
2. Make your changes and test them thoroughly.
3. Ensure that your code adheres to the project's coding style and guidelines.
4. Commit your changes with clear and descriptive commit messages.
5. Push your changes to your forked repository.
6. Submit a pull request to the main repository with a detailed description of
   your changes.

## Reporting Issues

If you encounter any issues or bugs, please report them by opening a new issue
on the [reoserv.net repository][reoserv.net]. Provide as much detail as
possible, including steps to reproduce the issue, expected behavior, and actual
behavior.

## Feature Requests

If you have an idea for a new feature or enhancement, feel free to open a new
issue on the [reoserv.net repository][reoserv.net] and describe your proposal.
We welcome suggestions and feedback from the community.

## Code Style and Guidelines

Please ensure that your code follows the project's coding style and guidelines.
We use [Biome][biome] for in-editor formatting & linting (on save) for
js/ts/jsx/tsx/css/json files, and [Prettier][prettier] for formatting markdown
files.

Before making a pull request, make sure your code is formatted and passes lint
checks as per the project guidelines. Run:

```sh
bun run lint
bun run lint:docs  # if you've changed any markdown files
```

## Testing [WIP]

Before submitting your pull request, make sure to run the project's tests and
ensure that all tests pass. You can run the tests with the following command:

```sh
bun run test
```

Thank you for your interest in contributing to the Reoserv project. We
appreciate your efforts and look forward to collaborating with you!

[reoserv.net]: https://github.com/sorokya/reoserv.net
[biome]: https://marketplace.visualstudio.com/items?itemName=biomejs.biome
[prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
