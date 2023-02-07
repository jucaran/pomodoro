#! /usr/bin/env node

import { exec } from 'child_process'
import inquirer from 'inquirer'
import clui from 'clui'
import keypress from 'keypress';

const currPath = import.meta.url.split('/').slice(2, -1).join('/')
const shortPauseSound = currPath + '/sounds/knock.mp3'
const longPauseSound = currPath + '/sounds/knock.mp3'
const resumeSound = currPath + '/sounds/drum.wav'

const answers = await inquirer.prompt([
  {
    name: 'interval',
    type: 'list',
    default: 2,
    message: 'Cuánto querés que tarden los intervalos?',
    choices: [
      { name: '5 minutos', short: '5min', value: 300 },
      { name: '7 minutos', short: '7min', value: 420 },
      { name: '10 minutos', short: '10min', value: 600 },
      { name: '15 minutos', short: '15min', value: 900 },
      { name: '20 minutos', short: '20min', value: 1200 },
      { name: '30 minutos', short: '30min', value: 1800 }
    ]
  },
  {
    name: 'shortPause',
    type: 'list',
    default: 0,
    message: 'Cuanto dura la pausa corta?',
    choices: [
      { name: '15 segundos', short: '15sec', value: 15 },
      { name: '30 segundos', short: '30sec', value: 30 },
      { name: '1 minuto', short: '1min', value: 60 },
      { name: '2 minutos', short: '2min', value: 120 },
      { name: '5 minutos', short: '5min', value: 300 },
      { name: '10 minutos', short: '10min', value: 600 }
    ]
  },
  {
    name: 'reps',
    type: 'list',
    default: 3,
    message: 'Cada cuantos intervalos una pausa larga?',
    choices: [
      { name: '2', short: '2', value: 2 },
      { name: '3', short: '3', value: 3 },
      { name: '4', short: '4', value: 4 },
      { name: '5', short: '5', value: 5 },
      { name: '6', short: '6', value: 6 },
      { name: '7', short: '7', value: 7 },
      { name: '8', short: '8', value: 8 },
      { name: '9', short: '9', value: 9 },
      { name: '10', short: '10', value: 10 }
    ]
  },
  {
    name: 'longPause',
    type: 'list',
    default: 2,
    message: 'Cuanto dura la pausa larga?',
    choices: [
      { name: '1 minuto', short: '1min', value: 60 },
      { name: '5 minutos', short: '5min', value: 300 },
      { name: '10 minutos', short: '10min', value: 600 },
      { name: '15 minutos', short: '15min', value: 900 },
      { name: '20 minutos', short: '20min', value: 1200 },
      { name: '30 minutos', short: '30min', value: 1800 }
    ]
  }
])

// const answers2 = { interval: 5, reps: 5, shortPause: 1, longPause: 1 }
// let { interval, reps, shortPause, longPause } = answers2
let { interval, reps, shortPause, longPause } = answers
let longPauseOn = false
let shortPauseOn = false
let remaining = interval
let remainingReps = reps
let longCompleted = 0
let stoped = false

// Para pausarlo
keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name == 'c') {
    process.exit()
  }
  if (key.name == 'space') {
    stoped = !stoped
  }
});
process.stdin.setRawMode(true);
process.stdin.resume();

while (true) {
  console.clear()

  if (stoped) console.log("PAUSADO")
  else --remaining

  const remainingParsed = new Date(remaining * 1000).toISOString().substring(14, 19)
  const pause = shortPauseOn || longPauseOn

  const Gauge = clui.Gauge
  if (pause) {
    if (shortPauseOn) {
      if(!stoped) console.log('En pausa corta')
      console.log(Gauge(shortPause - remaining, shortPause, 65, shortPause * 0.9, remainingParsed), '\n')
    } else {
      if(!stoped) console.log('En pausa larga')
      console.log(Gauge(longPause - remaining, longPause, 65, longPause * 0.9, remainingParsed), '\n')
    }
  } else {
    if(!stoped) console.log('En intervalo')
    console.log(Gauge(interval - remaining, interval, 65, interval * 0.9, remainingParsed), '\n')
  }

  console.log(`${reps - remainingReps + 1}/${reps}`, '\n')
  console.log(`${longCompleted} vueltas completas`)

  // Activar pausa corta
  if (remaining == 0 && remainingReps > 1 && !pause) {
    exec(`afplay ${shortPauseSound}`)
    shortPauseOn = true
    remaining = shortPause
    --remainingReps
  }

  // Activar pausa larga
  if (remaining == 0 && remainingReps == 1 && !pause) {
    exec(`afplay ${longPauseSound}`)
    longPauseOn = true
    remaining = longPause
    remainingReps = reps
  }

  // Termina la pausa
  else if (!!pause && !remaining) {
    exec(`afplay ${resumeSound}`)
    if (longPauseOn) ++longCompleted
    shortPauseOn = false
    longPauseOn = false
    remaining = interval
  }

  // sleep 1 segundo
  await new Promise(resolve => {
    setTimeout(resolve, 1000)
  })
}

