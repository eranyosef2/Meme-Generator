'use strict'

function init() {
  console.log('Initializing gallery...')
  renderGallery() 
}

function renderGallery() {
  const galleryEl = document.getElementById('img-gallery')
  const imgs = getImgs() 
  console.log('Rendering gallery with images:', imgs) 

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

  console.log('Rendering meme with image:', selectedImg)

  img.src = selectedImg.url
  img.onload = () => {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)


    const meme = getMeme()
    meme.lines.forEach(line => {
      console.log('Rendering text on canvas:', line) 
      ctx.font = `${line.size}px Arial`
      ctx.fillStyle = line.color
      ctx.fillText(line.txt, 50, 50) 
    })
  }

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
  