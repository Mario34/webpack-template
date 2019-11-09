import React from 'react'
import HelloImg from '@/assets/mario.jpeg'
import './HelloWorld.scss'

export default class App extends React.Component {
  render() {
    const { message } = this.props
    return (
      <div>
        <h1>{message}</h1>
        <img src={HelloImg} />
      </div>
    )
  }
}
