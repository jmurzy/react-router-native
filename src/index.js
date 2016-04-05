import { Component, AppRegistry } from 'react-native'

const render = (component, appKey = 'App') => {
  AppRegistry.registerComponent(appKey, () =>
    class extends Component {
      render() {
        return (
          component
        )
      }
    })
}

export { render }
