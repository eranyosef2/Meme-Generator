'use strict'

var ctx
var gElCanvas = document.getElementById('meme-canvas')
var gCurrColor = '#000000'  // Default color

function onInit() {
  renderGallery()
}

function renderGallery() {
  const galleryEl = document.getElementById('img-gallery')
  const imgs = getImgs()

  let strHTMLs = imgs.map(img => `<img src="${img.url}" onclick="onImgSelect(${img.id})" />`)
  galleryEl.innerHTML = strHTMLs.join('')
}

function onImgSelect(imgId) {
  setSelectedImg(imgId)
  showEditor()
  renderMeme()
}

function renderMeme() {
  const canvas = document.getElementById('meme-canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  const selectedImg = getSelectedImg()

  img.src = selectedImg.url
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
      ctx.font = `${line.size}px Arial`
      ctx.fillStyle = line.color
      ctx.fillText(line.txt, line.x, line.y)

      if (idx === meme.selectedLineIdx) {
        drawLineFrame(ctx, line)
      }
    })
  }
}

function drawLineFrame(ctx, line) {
  const textMetrics = ctx.measureText(line.txt)
  const padding = 10

  ctx.beginPath()
  ctx.rect(line.x - padding, line.y - line.size, textMetrics.width + padding * 2, line.size + padding * 2)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
}

function showEditor() {
  document.getElementById('img-gallery').style.display = 'none'
  document.getElementById('editor').style.display = 'block'
}

function showGallery() {
  document.getElementById('gallery').style.display = 'block'
  document.getElementById('img-gallery').style.display = 'flex'
  document.getElementById('editor').style.display = 'none'
  document.getElementById('about').style.display = 'none'
}

function showAbout() {
  document.getElementById('gallery').style.display = 'none'
  document.getElementById('editor').style.display = 'none'
  document.getElementById('about').style.display = 'block'
}

function onTextInputChange() {
  const newText = document.getElementById('text-input').value
  setLineTxt(newText)
  renderMeme()
}

function downloadCanvas(elLink) {
  const dataUrl = gElCanvas.toDataURL('image/jpeg')
  elLink.href = dataUrl
  elLink.download = 'my-img.jpg'
}

function onSetColor(ev) {
  gCurrColor = ev.target.value
  setLineColor(gCurrColor)
  renderMeme()
}

function onIncreaseFont() {
  changeFontSize(2)
}

function onDecreaseFont() {
  changeFontSize(-2)
}

function changeFontSize(diff) {
  const line = getMeme().lines[getMeme().selectedLineIdx]
  line.size += diff
  renderMeme()
}

function onAddLine() {
  const newLine = {
    txt: 'Enter Meme Text',  // Default text for the new line
    size: 20,
    color: gCurrColor,  // Use the current selected color
    x: 50,
    y: getNewLineYPosition()
  }
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  updateTextInput()
  renderMeme()
}

function getNewLineYPosition() {
  const canvas = document.getElementById('meme-canvas')
  const lineCount = gMeme.lines.length
  const lineHeight = 50
  return canvas.height / 2 + lineCount * lineHeight
}

function onSwitchLine() {
  const meme = getMeme()
  const totalLines = meme.lines.length
  meme.selectedLineIdx = (meme.selectedLineIdx + 1) % totalLines
  updateTextInput()
  renderMeme()
}

function updateTextInput() {
  const selectedLine = getMeme().lines[getMeme().selectedLineIdx]
  const textInput = document.getElementById('text-input')
  textInput.value = selectedLine.txt === 'Enter Meme Text' ? '' : selectedLine.txt
  textInput.placeholder = 'Enter Meme Text'
}