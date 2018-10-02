const imageUpload = document.querySelector('#image_upload')
const imageContainer = document.querySelector('#image_container')
const uploadContainer = document.querySelector('#upload_container')
const memeCanvasContainer = document.querySelector('#meme_canvas_container')
const memeUpperTextInput = document.querySelector('#meme_upper_text_input')
const memeLowerTextInput = document.querySelector('#meme_lower_text_input')
const memeImgWidthInput = document.querySelector('#meme_image_width_input')
const memeCanvas = document.querySelector('#meme_canvas')
const ctx = memeCanvas.getContext('2d')

let memeImg = null
let memeImgHeight = null
let memeImgWidth = null
const memeCanvasProps = {
  fontSize: 30,
  lineSpacing: 5
}

function getAdditionalCanvasHeight () {
  const { fontSize, lineSpacing } = memeCanvasProps
  return 2 * (fontSize + lineSpacing * 2)
}

imageUpload.addEventListener('change', e => {
  if (!e.target.files[0]) { return }
  const img = document.createElement('img')
  const blob = URL.createObjectURL(e.target.files[0])
  img.src = blob
  img.onload = function () {
    memeImgHeight = img.height
    memeImgWidth = img.width
  }
  memeImg = img.cloneNode()
  img.width = 300
  img.classList.add('border-2', 'border-dashed', 'border-grey')
  imageContainer.innerHTML = ''
  imageContainer.appendChild(img)
})

image_upload_form.addEventListener('submit', e => { // eslint-disable-line
  e.preventDefault()
  uploadContainer.innerHTML = ''

  initializeMemeCanvas()
})

function initializeMemeCanvas () {
  const additionalCanvasHeight = getAdditionalCanvasHeight()

  memeImgWidthInput.value = memeImgWidth
  memeCanvas.height = memeImgHeight + additionalCanvasHeight
  memeCanvas.width = memeImgWidth
  ctx.drawImage(memeImg, 0, parseInt(additionalCanvasHeight / 2), memeImgWidth, memeImgHeight)
  memeCanvasContainer.classList.remove('hidden')
  memeCanvasContainer.classList.add('flex')
}

function setMemeUpperText (text) {
  text = text.toUpperCase()
  const { fontSize, lineSpacing } = memeCanvasProps

  ctx.clearRect(0, 0, memeCanvas.width, fontSize + lineSpacing)
  ctx.font = `${fontSize}px Impact`
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.fillText(text, memeCanvas.width / 2, fontSize + lineSpacing / 2)
}

function setMemeLowerText (text) {
  text = text.toUpperCase()
  const { fontSize, lineSpacing } = memeCanvasProps

  ctx.clearRect(0, memeCanvas.height - (fontSize + 2 * lineSpacing), memeCanvas.width, fontSize + 2 * lineSpacing)
  ctx.font = `${fontSize}px Impact`
  ctx.fillStyle = 'black'
  ctx.textAlign = 'center'
  ctx.fillText(text, memeCanvas.width / 2, (memeCanvas.height - (fontSize + 2 * lineSpacing)) + (fontSize + lineSpacing / 2))
}

memeUpperTextInput.addEventListener('input', e => {
  setMemeUpperText(e.target.value)
})

memeLowerTextInput.addEventListener('input', e => {
  setMemeLowerText(e.target.value)
})

memeImgWidthInput.addEventListener('input', e => {
  const width = parseInt(e.target.value)
  if (!width) return
  const additionalCanvasHeight = getAdditionalCanvasHeight()
  const htw = memeImgHeight / memeImgWidth
  memeImgWidth = width
  memeImgHeight = memeImgWidth * htw
  memeCanvas.height = memeImgHeight + additionalCanvasHeight
  memeCanvas.width = width
  ctx.drawImage(memeImg, 0, parseInt(additionalCanvasHeight / 2), memeImgWidth, memeImgHeight)
  setMemeUpperText(memeUpperTextInput.value)
  setMemeLowerText(memeLowerTextInput.value)
})

function saveAsImage () { // eslint-disable-line
  const bottomCanvas = document.createElement('canvas')
  bottomCanvas.height = memeCanvas.height
  bottomCanvas.width = memeCanvas.width
  const ctx2 = bottomCanvas.getContext('2d')
  ctx2.fillStyle = 'white'
  ctx2.fillRect(0, 0, memeCanvas.width, memeCanvas.height)
  ctx2.drawImage(memeCanvas, 0, 0)
  var link = document.createElement('a')
  link.setAttribute('download', 'Meme.png')
  link.setAttribute('href', bottomCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'))
  link.click()
}
