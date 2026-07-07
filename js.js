(function() {
    'use strict';

    const TOTAL_CELLS = 42;
    const IMAGE_BASE_PATH = 'Maniac/';
    const IMAGE_EXTENSION = '.png';

    const gridContainer = document.getElementById('gridContainer');
    const counterDisplay = document.getElementById('counterDisplay');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const emptyText = previewContainer.querySelector('.empty');

    let markedCount = 0;
    let isFirstClick = true;

    const imageUrls = [];
    for (let i = 1; i <= TOTAL_CELLS; i++) {
        imageUrls.push(IMAGE_BASE_PATH + i + IMAGE_EXTENSION);
    }

    function updateCounter() {
        if (counterDisplay) {
            counterDisplay.innerHTML = `💀 <strong>${markedCount}</strong> / ${TOTAL_CELLS} ✕`;
        }
    }

    function setSelectedImage(src) {
        if (src && src !== '') {
            previewImage.src = src;
            previewImage.style.display = 'block';
            emptyText.style.display = 'none';
        } else {
            clearSelectedImage();
        }
    }

    function clearSelectedImage() {
        previewImage.style.display = 'none';
        emptyText.style.display = 'block';
        previewImage.src = '';
    }

    function toggleMark(cell) {
        if (!cell) return;
        if (cell.classList.contains('marked')) {
            cell.classList.remove('marked');
            markedCount--;
        } else {
            cell.classList.add('marked');
            markedCount++;
        }
        updateCounter();
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    function resetAll() {
        const allCells = document.querySelectorAll('.cell');
        allCells.forEach(cell => {
            cell.classList.remove('marked');
        });
        markedCount = 0;
        isFirstClick = true;
        clearSelectedImage();
        updateCounter();
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    }

    for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;

        const img = document.createElement('img');
        img.src = imageUrls[i];
        img.alt = `Клетка ${i + 1}`;
        img.loading = 'lazy';

        const placeholder = document.createElement('div');
        placeholder.className = 'error-placeholder';
        placeholder.textContent = '⚠️ Нет';

        img.addEventListener('error', function() {
            this.classList.add('error');
            placeholder.style.display = 'flex';
        });

        img.addEventListener('load', function() {
            placeholder.style.display = 'none';
        });

        cell.appendChild(img);
        cell.appendChild(placeholder);

        cell.addEventListener('click', function(e) {
            if (isFirstClick) {
                const imgSrc = this.querySelector('img').src;
                if (imgSrc && imgSrc !== '') {
                    setSelectedImage(imgSrc);
                }
                isFirstClick = false;
                return;
            }

            if (e.detail === 2) {
                toggleMark(this);
                return;
            }

            if (!this.classList.contains('marked')) {
                this.classList.add('marked');
                markedCount++;
                updateCounter();
                if (navigator.vibrate) {
                    navigator.vibrate(12);
                }
            }
        });

        gridContainer.appendChild(cell);
    }

    updateCounter();

    if (counterDisplay) {
        counterDisplay.addEventListener('dblclick', resetAll);
        counterDisplay.title = 'Двойной клик — сбросить всё';
    }
})();