## Examples

### Aviato

To build and run the Aviato app:

```bash
git clone https://github.com/jmurzy/react-router-native

cd react-router-native/examples/Aviato
npm install
```

To deploy to iOS simulator:

```bash
npm run ios
```

—or—

To deploy to Android simulator:

```bash
npm run android
```
Please note that the __address bar__ is used for development only and can be disabled by removing the [`addressBar`](https://github.com/jmurzy/react-router-native/blob/b988ea696cca272296c424e7381df00944c9d062/examples/Aviato/app/routes.js#L23-L24) prop from the ``<Router>`` component.
