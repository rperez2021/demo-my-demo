const { app, BrowserWindow, ipcMain, dialog, Menu, BrowserView } = require('electron')
const path = require('path')


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true,
      webSecurity: false
    },
  })
  win.loadFile('index.html')

  // win.webContents.openDevTools()

  const secondView = new BrowserView()
  win.addBrowserView(secondView)
  secondView.setBounds({ x: 400, y: 0, width: 600, height: 600 })
  secondView.setAutoResize({ width: true, height: true })

  ipcMain.on('change-page', (event, page, script, tagid) => {
    const pageToLoad = page
    const src = script
    const id = tagid
    secondView.webContents.loadURL(pageToLoad)
    console.log(script)
    secondView.webContents.executeJavaScript(`
        const scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', '${src}');
        scriptTag.setAttribute('id', '${id}');
        scriptTag.setAttribute('type', 'text/javascript');
        document.body.appendChild(scriptTag);
    `, true)
      .catch((err) => {
        console.log(err)
      })
    secondView.webContents.on('did-finish-load', function () {
      secondView.webContents.executeJavaScript(`
      const scriptTag = document.createElement('script');
      scriptTag.setAttribute('src', '${src}');
      scriptTag.setAttribute('id', '${id}');
      scriptTag.setAttribute('type', 'text/javascript');
      document.body.appendChild(scriptTag);
  `, true)
        .catch((err) => {
          console.log(err)
        })
    });
    secondView.webContents.openDevTools()
    win.loadFile('customization.html')
  })

}

app.on('activate', (event, hasVisibleWindows) => {
  if (!hasVisibleWindows) { createWindow(); }
});


app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  win.removeBrowserView(secondView)
  win.removeBrowserView(view)
  app.quit()
})
