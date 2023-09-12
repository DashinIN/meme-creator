const dropContainer = document.querySelector(".drop-container")

dropContainer.addEventListener("dragover", (e) => {
  e.preventDefault()
}, false)

dropContainer.addEventListener("dragenter", () => {
  dropContainer.classList.add("drag-active")
})

dropContainer.addEventListener("dragleave", () => {
  dropContainer.classList.remove("drag-active")
})


dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.classList.remove("drag-active")
    e.target.files = e.dataTransfer.files
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImage = new Image();
        uploadedImage.src = e.target.result;
        uploadedImage.onload = () => {
            canvas.width = uploadedImage.width;
            canvas.height = uploadedImage.height;
            ctx.drawImage(uploadedImage, 0, 0);
        };
    };
    reader.readAsDataURL(file);
    downloadButton.style.display = 'block'
  })