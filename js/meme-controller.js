'use strict'

var ctx
var gCurrColor = '#000000'
var gElCanvas

function onInit() {
  gElCanvas = document.getElementById('meme-canvas')
  gElCanvas.addEventListener('click', onCanvasClick)
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
  const ctx = gElCanvas.getContext('2d')
  const img = new Image()
  const selectedImg = getSelectedImg()

  img.src = selectedImg.url
  img.onload = () => {
    ctx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    ctx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)

    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
      ctx.font = `${line.size}px ${line.font || 'Impact'}`
      ctx.fillStyle = line.color || 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3
      ctx.textAlign = line.align || 'left'

      let xPos
      if (line.align === 'center') {
        xPos = gElCanvas.width / 2
      } else if (line.align === 'right') {
        xPos = gElCanvas.width - 50
      } else {
        xPos = 50
      }

      ctx.strokeText(line.txt, xPos, line.y)
      ctx.fillText(line.txt, xPos, line.y)

      if (idx === meme.selectedLineIdx) {
        drawLineFrame(ctx, line, xPos)
      }
    })
  }
}

function drawLineFrame(ctx, line, xPos) {
  const textMetrics = ctx.measureText(line.txt)
  const padding = 10

  ctx.beginPath()
  if (line.align === 'center') {
    ctx.rect(xPos - textMetrics.width / 2 - padding, line.y - line.size, textMetrics.width + padding * 2, line.size + padding * 2)
  } else if (line.align === 'right') {
    ctx.rect(xPos - textMetrics.width - padding, line.y - line.size, textMetrics.width + padding * 2, line.size + padding * 2)
  } else {
    ctx.rect(xPos - padding, line.y - line.size, textMetrics.width + padding * 2, line.size + padding * 2)
  }
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
}


function showGallery() {
  document.getElementById('gallery').style.display = 'block';
  document.getElementById('editor-container').style.display = 'none';
  document.getElementById('about').style.display = 'none';
}

function showEditor() {
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('editor-container').style.display = 'flex';
  document.getElementById('about').style.display = 'none';
}

function showAbout() {
  document.getElementById('gallery').style.display = 'none';
  document.getElementById('editor-container').style.display = 'none';
  document.getElementById('about').style.display = 'block';
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

function setLineColor(newColor) {
  gMeme.lines[gMeme.selectedLineIdx].color = newColor
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
    txt: 'Enter Meme Text',
    size: 20,
    color: 'white',
    x: 50,
    y: getNewLineYPosition()
  }
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  updateTextInput()
  renderMeme()
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

  const colorInput = document.getElementById('color')
  colorInput.value = selectedLine.color
}

function onCanvasClick(ev) {
  const { offsetX, offsetY } = ev
  const meme = getMeme()
  const ctx = gElCanvas.getContext('2d')

  const clickedLine = meme.lines.find(line => {
    ctx.font = `${line.size}px ${line.font || 'Impact'}` // Match font and size
    const textWidth = ctx.measureText(line.txt).width

    let xPos
    if (line.align === 'center') {
      xPos = gElCanvas.width / 2 - textWidth / 2
    } else if (line.align === 'right') {
      xPos = gElCanvas.width - textWidth - 50
    } else {
      xPos = 50
    }

    return (
      offsetX >= xPos &&
      offsetX <= xPos + textWidth &&
      offsetY >= line.y - line.size &&
      offsetY <= line.y
    )
  })

  if (clickedLine) {
    meme.selectedLineIdx = meme.lines.indexOf(clickedLine)
    updateTextInput()
    renderMeme()
  }
}

function onSetTextAlign(align) {
  gMeme.lines[gMeme.selectedLineIdx].align = align
  renderMeme()
}

function onSetFontFamily(font) {
  gMeme.lines[gMeme.selectedLineIdx].font = font
  renderMeme()
}
function onMoveLineUp() {
  const line = getMeme().lines[getMeme().selectedLineIdx]
  line.y -= 10
  renderMeme()
}

function onMoveLineDown() {
  const line = getMeme().lines[getMeme().selectedLineIdx]
  line.y += 10
  renderMeme()
}

function onDeleteLine() {
  const meme = getMeme()

  if (meme.lines.length === 1) {
    alert('Cant delete the last line!')
    return
  }
  meme.lines.splice(meme.selectedLineIdx, 1)
  meme.selectedLineIdx = Math.min(meme.selectedLineIdx, meme.lines.length - 1)  
  updateTextInput()
  renderMeme()
}