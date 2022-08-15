const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {
  changePage: (page, script, tagid) => ipcRenderer.send('change-page', page, script, tagid),
  changeStyles: (styles) => ipcRenderer.send('change-styles', styles),
  hideNavbar: () => ipcRenderer.send('hide-navbar'),
})
