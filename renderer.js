const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.ping()
  const ping = document.getElementById('ping')
  console.log(response) // prints out 'pong'
  ping.innerText = response
}

func()

const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
    const title = titleInput.value
    window.electronAPI.setTitle(title)
});

const btn = document.getElementById('btn2')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})

const counter = document.getElementById('counter')

window.electronAPI.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})

const urlInput = document.getElementById('url')
const scriptInput = document.getElementById('script')
const btn3 = document.getElementById('btn3')
btn3.addEventListener('click', () => {
  const page = urlInput.value
  const script = scriptInput.value
  window.electronAPI.changePage(page, script)
});
