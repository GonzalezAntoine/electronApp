import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 🔥 MÉTHODES EXISTANTES
const api = {
  getData: () => ipcRenderer.invoke('get-data')
}

// 🔥 NOUVELLES MÉTHODES POUR LA TOP BAR
const windowControls = {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
}

// Exposition dans le renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('windowControls', windowControls)
  } catch (error) {
    console.error(error)
  }
} else {
  // fallback
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
  // @ts-ignore
  window.windowControls = windowControls
}
