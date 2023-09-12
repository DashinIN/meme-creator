const imageInput = document.querySelector('.image-input');
const canvas = document.querySelector('.canvas');
const ctx = canvas.getContext('2d');
const textInput = document.querySelector('.text-input');
const addTextButton = document.querySelector('.add-text-button');
const downloadButton = document.querySelector('.download-button');
const textControls = document.querySelector('.text-controls');
const fontSizeInput = document.querySelector('.font-size');
const fontWeightSelect = document.querySelector('.font-weight');
const textColorInput = document.querySelector('.text-color');
const applyChangesButton = document.querySelector('.apply-changes-button');
const textList = document.querySelector('.text-list');

let uploadedImage;
let textObjects = [];
let selectedTextIndex = -1;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Функция для отображения всех текстовых объектов на холсте
function renderTextObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0);

    for (let i = 0; i < textObjects.length; i++) {
        const textObject = textObjects[i];
        ctx.font = `${textObject.fontWeight} ${textObject.fontSize}px Arial`;
        ctx.fillStyle = textObject.color;
        ctx.fillText(textObject.text, textObject.x, textObject.y);
    }
}

// Функция для обновления позиции текстового объекта при перетаскивании
function updateTextPosition(x, y) {
    if (selectedTextIndex !== -1) {
        const textObject = textObjects[selectedTextIndex];
        textObject.x = x - dragOffsetX;
        textObject.y = y - dragOffsetY;
        renderTextObjects();
    }
}

// Функция для активации редактирования текста
function activateTextEditing(index) {
selectedTextIndex = index;
const textObject = textObjects[selectedTextIndex];
fontSizeInput.value = textObject.fontSize;
fontWeightSelect.value = textObject.fontWeight;
textColorInput.value = textObject.color;
textControls.style.display = 'flex';
applyChangesButton.style.display = 'block';
textInput.value = textObject.text;
renderTextObjects();

// Удалите выделение для всех элементов списка
const textItems = document.querySelectorAll('.text-item');
    textItems.forEach((item) => {
        item.classList.remove('selected');
    });
    // Выделите выбранный элемент списка
    textItems[index].classList.add('selected');
    }

// Функция для удаления текстового объекта
function deleteText(index) {
    textObjects.splice(index, 1);
    selectedTextIndex = -1;
    renderTextObjects();
    updateTextList();
    textControls.style.display = 'none';
    applyChangesButton.style.display = 'none';

    // Удалите выделение для всех элементов списка
    const textItems = document.querySelectorAll('.text-item');
    textItems.forEach((item) => {
    item.classList.remove('selected');
});
}

// Функция для обновления списка текстовых надписей
function updateTextList() {
    textList.innerHTML = '';
    for (let i = 0; i < textObjects.length; i++) {
        const textObject = textObjects[i];
        const listItem = document.createElement('div');
        listItem.className = 'text-item';
        listItem.textContent = textObject.text;
        listItem.addEventListener('click', () => {
            activateTextEditing(i);
        });
        listItem.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            deleteText(i);
        });
      
        textList.appendChild(listItem);
    }
}

// Обработчик события выбора изображения
imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
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
    }
});




// Обработчик события для добавления текстовой надписи
addTextButton.addEventListener('click', () => {
    const text = textInput.value;
    if (text) {
        const x = 20;
        const y = 40;
        const fontSize = parseInt(fontSizeInput.value);
        const fontWeight = fontWeightSelect.value;
        const color = textColorInput.value;
        const textObject = { text, x, y, fontSize, fontWeight, color };
        textObjects.push(textObject);
        renderTextObjects();
        updateTextList();
        textInput.value = ''; // Очищаем поле ввода текста
    }
});

// Обработчик события для клика по холсту (перетаскивание текста)
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    
    for (let i = textObjects.length - 1; i >= 0; i--) {
        const textObject = textObjects[i];
        ctx.font = `${textObject.fontWeight} ${textObject.fontSize}px Arial`;
        const textWidth = ctx.measureText(textObject.text).width;
        const textHeight = textObject.fontSize;
        if (
            mouseX >= textObject.x &&
            mouseX <= textObject.x + textWidth &&
            mouseY >= textObject.y - textHeight &&
            mouseY <= textObject.y
        ) {
            activateTextEditing(i);
            // Вычисляем смещение относительно точки, в которой пользователь кликнул на текст
            dragOffsetX = mouseX - textObject.x;
            dragOffsetY = mouseY - textObject.y;
            isDragging = true;
            return;
        }
    }

    selectedTextIndex = -1;
    textControls.style.display = 'none';
    applyChangesButton.style.display = 'none';
    isDragging = false;
});

// Обработчик события для перемещения мыши (перетаскивание текста)
canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const mouseX = event.clientX - canvas.getBoundingClientRect().left;
        const mouseY = event.clientY - canvas.getBoundingClientRect().top;
        updateTextPosition(mouseX, mouseY);
    }
});

// Обработчик события для отпускания кнопки мыши (перетаскивание текста)
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Обработчик события для выхода мыши за пределы холста (перетаскивание текста)
canvas.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Обработчик события для применения изменений в тексте
applyChangesButton.addEventListener('click', () => {
    if (selectedTextIndex !== -1) {
        const textObject = textObjects[selectedTextIndex];
        textObject.fontSize = parseInt(fontSizeInput.value);
        textObject.fontWeight = fontWeightSelect.value;
        textObject.color = textColorInput.value;
        textObject.text = textInput.value;
        renderTextObjects();
        updateTextList();
    }
});

// Обработчик события для скачивания обновленного изображения
downloadButton.addEventListener('click', () => {
    if (uploadedImage) {
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'edited_image.png';
        downloadLink.click();
    }
});

// Инициализация списка текстовых надписей
updateTextList();



