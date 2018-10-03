const imageUpload = document.querySelector('#image_upload')
const imageContainer = document.querySelector('#image_container')
const uploadContainer = document.querySelector('#upload_container')
const memeCanvasContainer = document.querySelector('#meme_canvas_container')
const memeUpperTextInput = document.querySelector('#meme_upper_text_input')
const memeLowerTextInput = document.querySelector('#meme_lower_text_input')
const memeImgWidthInput = document.querySelector('#meme_image_width_input')
const imgCanvas = document.querySelector('#canvas_img')
const txtAboveCanvas = document.querySelector('#canvas_txt_above')
const txtBelowCanvas = document.querySelector('#canvas_txt_below')
const canvasSet = document.querySelector('#canvas_set')
const saveImageLink = document.querySelector('#save_image_link')
const imgCtx = imgCanvas.getContext('2d')
const txtAboveCtx = txtAboveCanvas.getContext('2d')
const txtBelowCtx = txtBelowCanvas.getContext('2d')

// will change to Proxy if gets complicated

let memeImg = null
const memeCanvasProps = {
  fontSize: 30,
  lineSpacing: 2,
  fontColor: 'black',
  bgColor: 'white'
}

imageUpload.addEventListener('change', e => {
  if (!e.target.files[0]) { return }
  const img = document.createElement('img')
  const blob = URL.createObjectURL(e.target.files[0])
  img.src = blob
  memeImg = img.cloneNode()
  img.onload = e => {
    const htw = img.height / img.width
    memeImg.width = 400
    memeImg.height = memeImg.width * htw
  }
  img.width = 300
  img.classList.add('border-2', 'border-dashed', 'border-grey')
  imageContainer.innerHTML = ''
  imageContainer.appendChild(img)
})

function wrapAndDrawText (canvas, context, text) {
  const { fontSize, lineSpacing } = memeCanvasProps
  const maxWidth = canvas.width - 18
  const words = text.split(' ')
  const lines = ['']

  for (const word of words) {
    const lastLine = lines[lines.length - 1]
    const testLine = lastLine.length ? lastLine + ' ' + word : word
    const testWidth = context.measureText(testLine).width
    if (testWidth >= maxWidth) {
      lines.push(word)
    } else {
      lines[lines.length - 1] = testLine
    }
  }

  const totalHeight = fontSize * lines.length + lineSpacing * (lines.length + 1)
  if (totalHeight !== canvas.height) {
    canvas.height = totalHeight
  }

  context.font = `${fontSize}px Impact`
  context.fillStyle = memeCanvasProps.fontColor
  context.textAlign = 'center'

  const nextHeight = lineSpacing + fontSize
  let paintingHeight = fontSize
  for (const line of lines) {
    context.fillText(line, canvas.width / 2, paintingHeight)
    paintingHeight += nextHeight
  }
}

image_upload_form.addEventListener('submit', e => { // eslint-disable-line
  e.preventDefault()

  if (!imageUpload.files[0]) {
    alert('No image is uploaded. So app won\'t proceed') // eslint-disable-line
    return false
  }

  uploadContainer.innerHTML = ''
  initializeCanvas()
})

function initializeCanvas () {
  const { fontSize, lineSpacing } = memeCanvasProps
  const { width } = memeImg
  memeImgWidthInput.value = width
  imgCanvas.height = memeImg.height
  imgCanvas.width = width
  imgCtx.drawImage(memeImg, 0, 0, width, memeImg.height)
  txtAboveCanvas.width = width
  txtAboveCanvas.height = fontSize + 2 * lineSpacing
  txtBelowCanvas.width = width
  txtBelowCanvas.height = fontSize + 2 * lineSpacing
  memeCanvasContainer.classList.remove('hidden')
  memeCanvasContainer.classList.add('flex')
}

memeUpperTextInput.addEventListener('input', e => {
  setMemeUpperText(e.target.value)
})

memeLowerTextInput.addEventListener('input', e => {
  setMemeLowerText(e.target.value)
})

function setMemeUpperText (text) {
  text = text.toUpperCase()
  txtAboveCtx.clearRect(0, 0, txtAboveCanvas.width, txtAboveCanvas.height)
  wrapAndDrawText(txtAboveCanvas, txtAboveCtx, text.trim())
}

function setMemeLowerText (text) {
  text = text.trim(' ').toUpperCase()
  txtBelowCtx.clearRect(0, 0, txtBelowCanvas.width, txtBelowCanvas.height)
  wrapAndDrawText(txtBelowCanvas, txtBelowCtx, text)
}

memeImgWidthInput.addEventListener('input', e => {
  const width = parseInt(e.target.value)
  if (!width || width < 40) return
  setWidthAndRepaint(width)
})

function repaintCanvas () {
  imgCtx.drawImage(memeImg, 0, 0, memeImg.width, memeImg.height)
  setMemeUpperText(memeUpperTextInput.value)
  setMemeLowerText(memeLowerTextInput.value)
}

function setWidthAndRepaint (width) {
  const htw = memeImg.height / memeImg.width
  memeImg.width = width
  memeImg.height = memeImg.width * htw
  imgCanvas.width = width
  imgCanvas.height = memeImg.height
  txtAboveCanvas.width = width
  txtBelowCanvas.width = width
  repaintCanvas()
  // TEMP_FIX
  repaintCanvas()
}

saveImageLink.addEventListener('click', e => {
  const finalCanvas = document.createElement('canvas')
  finalCanvas.height = imgCanvas.height + txtAboveCanvas.height + txtBelowCanvas.height
  finalCanvas.width = imgCanvas.width
  const ctx = finalCanvas.getContext('2d')
  ctx.fillStyle = memeCanvasProps.bgColor
  ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)
  ctx.drawImage(txtAboveCanvas, 0, 0)
  ctx.drawImage(imgCanvas, 0, txtAboveCanvas.height)
  ctx.drawImage(txtBelowCanvas, 0, txtAboveCanvas.height + imgCanvas.height)
  e.target.download = 'Meme.png'
  e.target.href = finalCanvas.toDataURL()
})

function toggleTheme () { // eslint-disable-line
  canvasSet.classList.toggle('bg-white')
  canvasSet.classList.toggle('bg-pure-black')
  if (memeCanvasProps.fontColor === 'black') {
    memeCanvasProps.fontColor = 'white'
    memeCanvasProps.bgColor = 'black'
  } else {
    memeCanvasProps.fontColor = 'black'
    memeCanvasProps.bgColor = 'white'
  }
  repaintCanvas()
}
