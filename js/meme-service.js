'use strict'

var gImgs = []
for (let i = 1; i <= 18; i++) {
    gImgs.push({ id: i, url: `img/${i}.jpg`, keywords: ['funny', 'random'] })
  }
  
  var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'Enter meme Text', 
        size: 20,
        color: 'color',
        x: 150, 
        y: 50  
      },
      {
        txt: 'Enter meme Text', 
        size: 20,
        color: 'color',
        x: 150,
        y: 400 
      }
    ]
  }
 

  
  function getImgs() {
    return gImgs
  }
  
  function setSelectedImg(imgId) {
    console.log('Setting selected image ID to:', imgId) 
    gMeme.selectedImgId = imgId
  }
  
  function getSelectedImg() {
    return gImgs.find(img => img.id === gMeme.selectedImgId)
  }
  
  function getMeme() {
    return gMeme
  }
  
  function setLineTxt(newText) {
    gMeme.lines[gMeme.selectedLineIdx].txt = newText
  }

  function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color 
  }