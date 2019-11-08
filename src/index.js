import React from 'react'
import ReactDOM from 'react-dom'
import HelloWorld from './components/HellowWorld'


class App extends React.Component {
  render() {
    return <HelloWorld message='Hellow World'/>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'))