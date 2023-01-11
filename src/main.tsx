import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import { AppConsumer } from '@inlet/react-pixi'
import { parseBeatmap } from './libs/parseBeatmap'
import { GameState } from './state/GameState'
// import { store } from './libs/redux/store'

var beatmap = null
const GAME = new GameState()
var chart = null
var imported = false
document.getElementById('chartfile')?.addEventListener('change', () => {
  var fr = new FileReader()
  GAME.mode = 'menu'
  fr.onload = function () {
    var chart = fr.result as string
    imported = true
    beatmap = parseBeatmap(chart)
    GAME.beatmap = beatmap
    ReactDOM.render(
      <React.StrictMode>
        <App game={GAME} chart={beatmap} menutime={Date.now()}/>
      </React.StrictMode>,
      document.getElementById('root')
    )
  }
  fr.readAsText(
    (
      (document.getElementById('chartfile') as HTMLInputElement)
        .files as FileList
    )[0]
  )
})