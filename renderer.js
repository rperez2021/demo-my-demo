

const urlInput = document.getElementById('url')
const scriptInput = document.getElementById('script')
const idInput = document.getElementById('scriptId')

const btn3 = document.getElementById('btn3')
btn3.addEventListener('click', () => {
  const page = urlInput.value
  const script = scriptInput.value
  const tagid = idInput.value
  window.electronAPI.changePage(page, script, tagid)
});
