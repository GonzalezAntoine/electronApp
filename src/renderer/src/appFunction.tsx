import { ipcRenderer } from 'electron'
const ipc = ipcRenderer

/// minimize the window
export const minimizeWindow = () => {
  ipc.send('minimize-window')
}

/// close the window
export const closeWindow = () => {
  ipc.send('close-window')
}

/// maximize or restore the window
export const toggleMaximizeWindow = () => {
  ipc.send('toggle-maximize-window')
}
