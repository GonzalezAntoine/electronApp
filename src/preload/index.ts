import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// 🔥 ON AJOUTE ICI LES MÉTHODES PERSONNALISÉES
const api = {
  getData: () => ipcRenderer.invoke('get-data')
}

// Si l’isolation est active (normalement oui)
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // fallback
  // @ts-ignore
  window.electron = electronAPI
  // @ts-ignore
  window.api = api
}
