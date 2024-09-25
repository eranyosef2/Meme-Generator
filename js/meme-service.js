
var gImgs = []
for (let i = 1; i <= 18; i++) {
    gImgs.push({ id: i, url: `img/${i}.jpg`, keywords: ['funny', 'random'] })
  }
  
  var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
      { txt: 'I sometimes eat Falafel', size: 20, color: 'red', x: 50, y: 50}
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
