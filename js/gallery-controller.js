'use strict'

function onImgUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const ctx = gElCanvas.getContext('2d');
        ctx.clearRect(0, 0, gElCanvas.width, gElCanvas.height);
        ctx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height);
      };
    };
    reader.readAsDataURL(file);
  
    showEditor();
  }