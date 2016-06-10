## Contributing

Be it a bug fix, new feature, [documentation](/docs), or tests—we love pull requests from everyone. Every little bit helps.

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

<a name="bug"/>
## Found a Bug?

Look through the GitHub issues for bugs. Anything tagged with "bug" is open to whoever wants to implement it. If you'd like to report a bug, please provide a reproducible test case. If possible, submit a Pull Request with a failing test.

<a name="pr"/>
## Making a Pull Request?
The following guidelines will make your pull request easier to merge. So please, read on.

- Ensure that the project stays lightweight and maintainable
- Respect the coding style of the repository
```bash
npm run lint
```
You can also use `.editorconfig` to check some basic code style conventions. You can install an [editorconfig plugin](http://editorconfig.org/#download) for your preferred editor so that the relevant settings are automatically setup when you work on this project.

- Use ES2015 syntax when possible
- Avoid abbreviated words
- Write tests if you add code that should be tested
- Ensure the test suite passes
```bash
npm run spec
```
- Use Flow types, ensure there are no Flow errors
```bash
npm run flow
```
- Ensure CI passes successfully
```bash
npm test
```
- Write a good commit message

Please be patient when your changes aren't merged immediately.

<a name="hacking"/>
## Hacking

Unfortunately, React Native packager does not support symlinking so you cannot use [`npm link`](https://docs.npmjs.com/cli/link) when hacking on this library. You can learn more about that, [here](https://productpains.com/post/react-native/symlink-support-for-packager/).

The library code is specified as a [local dependency](local dependency) in the example's `package.json`. In order to hack on the library code, you need to sync it into `examples/Aviato/node_modules`. To do so, run:

```js
npm run watch
```

This will automatically watch the `modules` directory and sync your changes into `examples/Aviato/node_modules` every time something changes.

<a name="repo-format"/>
## Flat Repository Format
This project uses a flat repository structure. All source code is placed directly into `modules` directory. The main reason is that both `history` and `react-router` source repositories follow this convention and hacking on this library means hacking on those two as well. Mirroring the conventions used in those repos should make it easier to connect the pieces together.

<a name="feedback"/>
## Feedback

Feedback is always welcome. The best way to send feedback is to file an issue. If you are proposing a feature, explain in detail how it would work.

<a name="license"/>
## License
All pull requests that get merged will be made available under [the MIT license](https://github.com/jmurzy/react-router-native/blob/master/LICENSE.md), as the rest of the repository.
