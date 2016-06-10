# Contributing

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Project setup
1. Fork and clone the repo
2. If you haven't set up React Native, follow [these instructions](https://facebook.github.io/react-native/docs/getting-started.html)
2. `$ npm install` to install dependencies
3. `$ npm run test` to check you've got everything working
4. Create a branch for your PR

## Project code structure
This project uses a flat repo structure - all code is put into files in the `modules/` folder. The main reason is that both ``history`` and ``react-router`` repos follow this convention & hacking on this library means hacking on those two as well. Mirroring the conventions used in those repos makes it easier to connect the pieces. It can take time to get used to it, but give it five minutes. ;)

## Code Style
- We use [eslint](http://eslint.org/) and [flow](https://flowtype.org/). `npm test` checks that the code conforms to the configurations we use for these tools. They are also checked during CI.
- We use `.editorconfig` to check some basic code style conventions. You can install an [editorconfig plugin](http://editorconfig.org/#download) for your preferred editor so that the relevant settings (tabs vs spaces, amount of indent etc.) are automatically setup when you work on this project.
