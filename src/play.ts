import { exec } from 'child_process'

export const playSound = (path: string) => {
  if (process.platform == 'darwin') {
    return exec(`afplay ${path}`)
  }

  if (process.platform == 'linux') {
    return exec(`play ${path}`)
  }
}