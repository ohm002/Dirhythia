import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import { AppConsumer } from '@inlet/react-pixi';
import { parseBeatmap } from './libs/parseBeatmap'
// import { store } from './libs/redux/store'

document.getElementById('chartfile')?.addEventListener('change', () => {
  var beatmap
  var fr = new FileReader()
  fr.onload = function () {
    var chart = fr.result as string
    beatmap = parseBeatmap(chart)
    ReactDOM.render(
      <React.StrictMode>
          <App mode="editor" chart={beatmap}/>
      </React.StrictMode>,
      document.getElementById('root')
    )
    
  }
  fr.readAsText(((document.getElementById('chartfile') as HTMLInputElement).files as FileList)[0])
})