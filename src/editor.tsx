import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import { AppConsumer } from '@inlet/react-pixi';
// import { store } from './libs/redux/store'

ReactDOM.render(
  <React.StrictMode>
      <App mode="editor"/>
  </React.StrictMode>,
  document.getElementById('root')
)
