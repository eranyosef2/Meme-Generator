'use strict'

var ctx
var gCurrColor = '#000000'
var gElCanvas
var gIsDragging = false
var gDraggedLineIdx = null
var gDragStartOffset = { x: 0, y: 0 }

function onInit() {
  gElCanvas = document.getElementById('meme-canvas')
  gElCanvas.addEventListener('mousedown', onCanvasMouseDown)
  gElCanvas.addEventListener('mousemove', onCanvasMouseMove)
  gElCanvas.addEventListener('mouseup', onCanvasMouseUp)
  gElCanvas.addEventListener('mouseleave', onCanvasMouseUp)
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
      ctx.strokeStyle = line.strokeColor || 'black'
      ctx.lineWidth = 3
      ctx.textAlign = line.align || 'left'

      let xPos = line.x
      if (line.align === 'center') {
        xPos = gElCanvas.width / 2
      } else if (line.align === 'right') {
        xPos = gElCanvas.width - 50
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
  document.getElementById('gallery').style.display = 'block'
  document.getElementById('editor-container').style.display = 'none'
  document.getElementById('about').style.display = 'none'
  document.getElementById('saved-memes').style.display = 'none'
}

function showEditor() {
  document.getElementById('gallery').style.display = 'none'
  document.getElementById('editor-container').style.display = 'flex'
  document.getElementById('about').style.display = 'none'
  document.getElementById('saved-memes').style.display = 'none'
}

function showAbout() {
  document.getElementById('gallery').style.display = 'none'
  document.getElementById('editor-container').style.display = 'none'
  document.getElementById('about').style.display = 'block'
  document.getElementById('saved-memes').style.display = 'none'
}

function showSaved() {
  const savedMemes = getSavedMemes()
  const container = document.getElementById('saved-memes-container')
  container.innerHTML = ''

  savedMemes.forEach((meme, idx) => {
    const memeImg = document.createElement('img')
    memeImg.src = `img/${meme.selectedImgId}.jpg`
    memeImg.style.width = '150px'
    memeImg.onclick = () => onReEditMeme(idx)

    container.appendChild(memeImg)
  })

  document.getElementById('saved-memes').style.display = 'block'
  document.getElementById('gallery').style.display = 'none'
  document.getElementById('editor-container').style.display = 'none'
  document.getElementById('about').style.display = 'none'
}

function onReEditMeme(memeIdx) {
  const savedMemes = getSavedMemes()
  const meme = savedMemes[memeIdx]

  setMeme(meme)
  document.getElementById('saved-memes').style.display = 'none'
  document.getElementById('editor-container').style.display = 'block'
  document.getElementById('editor-container').style.display = 'flex'
  renderMeme()
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
function onSetStrokeColor(ev) {
  const strokeColor = ev.target.value;
  setLineStrokeColor(strokeColor);
  renderMeme();
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
    ctx.font = `${line.size}px ${line.font || 'Impact'}`
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
  const line = getMeme().lines[gMeme.selectedLineIdx]
  line.y -= 10
  renderMeme()
}

function onMoveLineDown() {
  const line = getMeme().lines[gMeme.selectedLineIdx]
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

function onSaveMeme() {
  saveMeme()
  alert('Meme saved!')
}

function onDeleteAllSavedMemes() {
  localStorage.removeItem(MEME_STORAGE_KEY)
  document.getElementById('saved-memes-container').innerHTML = ''
  alert('All saved memes have been deleted!')
}

function onShowEmojiPicker() {
  const emojiPicker = document.getElementById('emoji-picker')
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none'
}

function onEmojiSelect(emoji) {
  addEmojiToMeme(emoji)
}

function addEmojiToMeme(emoji) {
  const newLine = {
    txt: emoji,
    size: 50,
    color: 'white',
    x: 150,
    y: getNewLineYPosition()
  }
  gMeme.lines.push(newLine)
  gMeme.selectedLineIdx = gMeme.lines.length - 1
  updateTextInput()
  renderMeme()
  document.getElementById('emoji-picker').style.display = 'none'
}

function onCanvasMouseDown(ev) {
  const { offsetX, offsetY } = ev
  const meme = getMeme()
  const ctx = gElCanvas.getContext('2d')

  const clickedLine = meme.lines.find((line, idx) => {
    ctx.font = `${line.size}px ${line.font || 'Impact'}`
    const textWidth = ctx.measureText(line.txt).width

    let xPos
    if (line.align === 'center') {
      xPos = gElCanvas.width / 2 - textWidth / 2
    } else if (line.align === 'right') {
      xPos = gElCanvas.width - textWidth - 50
    } else {
      xPos = line.x
    }

    const isClicked = (
      offsetX >= xPos &&
      offsetX <= xPos + textWidth &&
      offsetY >= line.y - line.size &&
      offsetY <= line.y
    )

    if (isClicked) {
      gDraggedLineIdx = idx
      gIsDragging = true
      gElCanvas.style.cursor = 'grabbing'
      gDragStartOffset = { x: offsetX - xPos, y: offsetY - line.y }
      return true
    }
    return false
  })

  if (clickedLine) {
    gMeme.selectedLineIdx = meme.lines.indexOf(clickedLine)
    updateTextInput()
    renderMeme()
  }
}

function onCanvasMouseMove(ev) {
  if (!gIsDragging || gDraggedLineIdx === null) return

  const meme = getMeme()
  const { offsetX, offsetY } = ev
  const draggedLine = meme.lines[gDraggedLineIdx]

  draggedLine.x = offsetX - gDragStartOffset.x
  draggedLine.y = offsetY - gDragStartOffset.y
  renderMeme()
}

function onCanvasMouseUp() {
  gIsDragging = false
  gDraggedLineIdx = null
  gElCanvas.style.cursor = 'default'
}

function onShareFacebook() {
  const canvasUrl = gElCanvas.toDataURL('image/jpeg');
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canvasUrl)}`;
  window.open(facebookUrl, '_blank');
}