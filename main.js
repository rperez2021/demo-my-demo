const { app, BrowserWindow, ipcMain, dialog, Menu, BrowserView } = require('electron')
const path = require('path')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      webSecurity: false
    },
  })
  ipcMain.handle('ping', () => 'pong')
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send('update-counter', 1),
          label: 'Increment',
        },
        {
          click: () => win.webContents.send('update-counter', -1),
          label: 'Decrement',
        }
      ]
    }
  ])
  ipcMain.on('change-page', (event, page, script) => {
    const pageToLoad = page
    const scriptToLoad = script
    // const view = new BrowserView()
    // win.setBrowserView(view)
    // view.setBounds({ x: 0, y: 0, width: 800, height: 600 })
    win.webContents.loadURL(pageToLoad)
    console.log(script)
    win.webContents.executeJavaScript(`
    fetch("${scriptToLoad}")
    .then(resp => resp.text());
    `, true)
    .then((result) => {
      console.log('THIS HERE' + result)
      let code = result
      return code
    })
    .then((code) => {
      win.webContents.executeJavaScript(code, true)
    }).catch((err) => {
      console.log(err)
    })
  })
  Menu.setApplicationMenu(menu)
  win.loadFile('index.html')
  win.webContents.openDevTools()

}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

