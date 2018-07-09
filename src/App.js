import React, { Component } from 'react'

import Layout from './hoc/Layout/Layout'
import GameContainer from './containers/GameContainer/GameContainer'

class App extends Component {
  render() {
    return (
      <Layout>
        <GameContainer />
      </Layout>
    )
  }
}

export default App
