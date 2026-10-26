// ==========================================
// QUẢN LÝ CANVAS & HIỂN THỊ HÌNH ẢNH
// ==========================================

import { state, getTagById } from './state.js';
import { hexToRgba, formatDateVN, getOffsetDateISO, showToast } from './utils.js';
import { t, formatDate } from './i18n.js';
import { renderTagChoicesUI } from './tags.js';
import { renderOverlayBoxes } from './overlay.js';
import { syncAllViews } from './app.js';

let canvas = null;
let ctx = null;
let canvasWrapper = null;
let canvasViewport = null;
let emptyUploadOverlay = null;
let fileInput = null;

/**
 * Khởi tạo các DOM elements liên quan tới canvas
 */
export function initCanvasElements() {
    canvas = document.getElementById('annotationCanvas');
    ctx = canvas ? canvas.getContext('2d') : null;
    canvasWrapper = document.getElementById('canvasWrapper');
    canvasViewport = document.getElementById('canvasViewport');
    emptyUploadOverlay = document.getElementById('emptyUploadOverlay');
    fileInput = document.getElementById('fileInput');
}

export function getCanvas() {
    if (!canvas) initCanvasElements();
    return canvas;
}

export function getCanvasContext() {
    if (!ctx) initCanvasElements();
    return ctx;
}

/**
 * Thiết lập hình ảnh vào không gian làm việc
 * @param {HTMLImageElement} img - Ảnh vừa load
 * @param {string} [name] - Tên file ảnh
 */
export function setWorkspaceImage(img, name = null) {
    if (!canvas) initCanvasElements();

    state.currentImage = img;
    if (name) state.currentImageName = name;
    state.boundingBoxes = [];
    state.selectedBoxId = null;
    state.hoveredBoxId = null;
    state.boxCounter = 1;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    if (emptyUploadOverlay) emptyUploadOverlay.classList.add('hidden');
    if (canvasWrapper) canvasWrapper.classList.remove('hidden');

    const nameDisplay = document.getElementById('imgNameDisplay');
    const sizeDisplay = document.getElementById('imgSizeDisplay');
    if (nameDisplay) nameDisplay.textContent = state.currentImageName;
    if (sizeDisplay) sizeDisplay.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;

    updateCanvasDisplaySize();
    renderTagChoicesUI();
    syncAllViews();
}

/**
 * Cập nhật kích thước hiển thị của Canvas (Fit theo khung nhìn hoặc 100% gốc)
 */
export function updateCanvasDisplaySize() {
    if (!state.currentImage || !canvas) return;

    const fitBtn = document.getElementById('btnFitMode');

    if (state.fitToScreen) {
        const viewportRect = canvasViewport.getBoundingClientRect();
        const availW = Math.max(240, viewportRect.width - 64);
        const availH = Math.max(240, viewportRect.height - 64);

        const imgRatio = state.currentImage.naturalWidth / state.currentImage.naturalHeight;
        const viewRatio = availW / availH;

        let displayW, displayH;
        if (imgRatio > viewRatio) {
            displayW = Math.min(availW, state.currentImage.naturalWidth);
            displayH = displayW / imgRatio;
        } else {
            displayH = Math.min(availH, state.currentImage.naturalHeight);
            displayW = displayH * imgRatio;
        }

        canvas.style.width = `${Math.round(displayW)}px`;
        canvas.style.height = `${Math.round(displayH)}px`;
        if (fitBtn) fitBtn.textContent = t('btn_fit_mode_fit');
    } else {
        canvas.style.width = `${state.currentImage.naturalWidth}px`;
        canvas.style.height = `${state.currentImage.naturalHeight}px`;
        if (fitBtn) fitBtn.textContent = t('btn_fit_mode_original');
    }

    renderOverlayBoxes();
}

/**
 * Bật/tắt chế độ co giãn vừa khung nhìn
 */
export function toggleFitMode() {
    state.fitToScreen = !state.fitToScreen;
    updateCanvasDisplaySize();
}

/**
 * Vẽ lại Canvas: hình ảnh nền, khung khi xuất ảnh hoặc khung preview đang kéo chuột
 * @param {boolean} includeExportLabels - Khi xuất ảnh PNG tải về, bắt buộc vẽ nhãn & khung trực tiếp lên canvas
 */
export function redrawCanvas(includeExportLabels = false) {
    if (!state.currentImage || !canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.currentImage, 0, 0, canvas.width, canvas.height);

    const rect = canvas.getBoundingClientRect();
    const scaleFactor = rect.width > 0 ? (canvas.width / rect.width) : 1;
    const baseLineWidth = Math.max(2, 2.5 * scaleFactor);
    const fontSize = Math.max(12, Math.round(13 * scaleFactor));

    const showInlineCombosToggle = document.getElementById('showInlineCombosToggle');
    const showInlineCombos = showInlineCombosToggle ? showInlineCombosToggle.checked : true;

    // Khi xuất ảnh PNG tải về hoặc khi người dùng tắt lớp Combo DOM, vẽ đầy đủ khung và nhãn lên Canvas
    if (includeExportLabels || !showInlineCombos) {
        state.boundingBoxes.forEach((box, index) => {
            const tagInfo = getTagById(box.tagId);
            ctx.save();
            ctx.fillStyle = hexToRgba(box.color, 0.14);
            ctx.fillRect(box.x, box.y, box.width, box.height);

            ctx.strokeStyle = box.color;
            ctx.lineWidth = baseLineWidth;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            ctx.font = `700 ${fontSize}px Plus Jakarta Sans, sans-serif`;
            const noteSuffix = box.note ? ` (${box.note})` : '';
            const tagLabel = tagInfo.id ? `${tagInfo.id}-${tagInfo.name}` : tagInfo.name;
            const badgeText = `#${index + 1} ${tagInfo.icon} ${tagLabel}${noteSuffix}`;
            const textMetrics = ctx.measureText(badgeText);
            const padX = 8 * scaleFactor;
            const padY = 5 * scaleFactor;
            const badgeW = textMetrics.width + padX * 2;
            const badgeH = fontSize + padY * 2;

            const badgeX = Math.min(box.x, Math.max(0, canvas.width - badgeW));
            const badgeY = box.y - badgeH - 2 >= 0 ? (box.y - badgeH - 2) : box.y;

            ctx.fillStyle = box.color;
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6 * scaleFactor);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.textBaseline = 'middle';
            ctx.fillText(badgeText, badgeX + padX, badgeY + badgeH / 2);
            ctx.restore();
        });
    }

    // Vẽ khung đang được kéo chuột trực tiếp (Live Preview)
    if (state.interactionMode === 'draw') {
        const x = Math.min(state.startCoords.x, state.currentCoords.x);
        const y = Math.min(state.startCoords.y, state.currentCoords.y);
        const w = Math.abs(state.currentCoords.x - state.startCoords.x);
        const h = Math.abs(state.currentCoords.y - state.startCoords.y);

        const activeTag = getTagById(state.activeTagId);
        const activeColor = activeTag.color;

        ctx.save();
        ctx.fillStyle = hexToRgba(activeColor, 0.22);
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = activeColor;
        ctx.lineWidth = baseLineWidth;
        ctx.setLineDash([7 * scaleFactor, 4 * scaleFactor]);
        ctx.strokeRect(x, y, w, h);

        ctx.setLineDash([]);
        ctx.font = `700 ${fontSize}px JetBrains Mono, monospace`;
        const activeTagLabel = activeTag.id ? `${activeTag.id}-${activeTag.name}` : activeTag.name;
        const liveText = `${activeTag.icon} ${activeTagLabel} | ${w}×${h}px`;
        const tm = ctx.measureText(liveText);
        const pad = 7 * scaleFactor;
        const bw = tm.width + pad * 2;
        const bh = fontSize + pad * 1.7;

        const bx = Math.min(x, Math.max(0, canvas.width - bw));
        const by = (y - bh - 4 >= 0) ? (y - bh - 4) : (y + h + 4);

        ctx.fillStyle = activeColor;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, 6 * scaleFactor);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.fillText(liveText, bx + pad, by + bh / 2);
        ctx.restore();
    }
}

/**
 * Xử lý sự kiện khi người dùng chọn file ảnh từ máy tính
 * @param {Event} e
 */
export function handleFileSelect(e) {
    if (!fileInput) initCanvasElements();
    const file = e.target.files[0];
    if (file) loadImageFromFile(file);
    if (fileInput) fileInput.value = '';
}

/**
 * Đọc file ảnh từ Blob/File
 * @param {File} file
 */
export function loadImageFromFile(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Vui lòng chọn định dạng tệp hình ảnh hợp lệ!', 'rose');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            state.currentImageName = file.name;
            setWorkspaceImage(img, file.name);
            showToast(`Đã tải ảnh "${file.name}" (${img.naturalWidth}×${img.naturalHeight}px)`, 'emerald');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Nạp hình ảnh từ một URL trực tuyến hoặc Base64
 * @param {string} url - Đường dẫn ảnh hoặc data:image
 * @param {string} [name] - Tên hiển thị của ảnh
 */
export function loadImageFromUrl(url, name = null) {
    if (!url) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        const imageName = name || (url.startsWith('data:') ? 'embedded_image.png' : url.split('/').pop().split('?')[0]) || 'remote_image.png';
        state.currentImageName = imageName;
        setWorkspaceImage(img, imageName);
        showToast(`Đã nạp ảnh "${imageName}" (${img.naturalWidth}×${img.naturalHeight}px)`, 'emerald');
    };
    img.onerror = function() {
        showToast(`Không thể tải ảnh từ URL: ${url}`, 'rose');
    };
    img.src = url;
}

/**
 * Tạo ảnh mẫu demo nghệ thuật sinh động để người dùng trải nghiệm ngay
 * @param {boolean} isInitial - Khởi tạo lần đầu kèm 2 khung mẫu
 */
export function loadDemoImage(isInitial = false) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 980;
    tempCanvas.height = 600;
    const tCtx = tempCanvas.getContext('2d');

    const grad = tCtx.createLinearGradient(0, 0, 980, 600);
    grad.addColorStop(0, '#fff1eb');
    grad.addColorStop(0.5, '#ffe4ef');
    grad.addColorStop(1, '#f3e8ff');
    tCtx.fillStyle = grad;
    tCtx.fillRect(0, 0, 980, 600);

    tCtx.fillStyle = 'rgba(255, 123, 0, 0.08)';
    tCtx.beginPath(); tCtx.arc(160, 120, 180, 0, Math.PI * 2); tCtx.fill();
    tCtx.fillStyle = 'rgba(255, 42, 109, 0.07)';
    tCtx.beginPath(); tCtx.arc(820, 460, 210, 0, Math.PI * 2); tCtx.fill();

    tCtx.strokeStyle = 'rgba(244, 63, 94, 0.07)';
    tCtx.lineWidth = 1;
    for (let x = 0; x < 980; x += 40) {
        tCtx.beginPath(); tCtx.moveTo(x, 0); tCtx.lineTo(x, 600); tCtx.stroke();
    }
    for (let y = 0; y < 600; y += 40) {
        tCtx.beginPath(); tCtx.moveTo(0, y); tCtx.lineTo(980, y); tCtx.stroke();
    }

    // Vật thể mẫu 1: Laptop Sáng Tạo
    tCtx.fillStyle = '#312e81';
    tCtx.beginPath();
    tCtx.roundRect(100, 165, 330, 215, 16);
    tCtx.fill();
    const screenGrad = tCtx.createLinearGradient(118, 183, 412, 355);
    screenGrad.addColorStop(0, '#ff2a6d');
    screenGrad.addColorStop(1, '#ff7b00');
    tCtx.fillStyle = screenGrad;
    tCtx.beginPath();
    tCtx.roundRect(118, 183, 294, 170, 8);
    tCtx.fill();
    tCtx.fillStyle = '#4338ca';
    tCtx.beginPath();
    tCtx.roundRect(75, 380, 380, 22, 8);
    tCtx.fill();
    tCtx.fillStyle = '#ffffff';
    tCtx.font = 'bold 17px Plus Jakarta Sans, sans-serif';
    tCtx.fillText('💻 Laptop Sáng Tạo', 185, 272);

    // Vật thể mẫu 2: Ly Trà Đào Cam Sả
    tCtx.fillStyle = '#ff7b00';
    tCtx.beginPath();
    tCtx.arc(645, 295, 76, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.fillStyle = '#fff7ed';
    tCtx.beginPath();
    tCtx.arc(645, 295, 58, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.fillStyle = '#f97316';
    tCtx.beginPath();
    tCtx.arc(645, 295, 46, 0, Math.PI * 2);
    tCtx.fill();
    tCtx.fillStyle = '#ffffff';
    tCtx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    tCtx.fillText('🍹 Đồ uống', 605, 300);

    tCtx.fillStyle = '#be123c';
    tCtx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    tCtx.fillText('👆 Bấm trực tiếp vào Combo Tag hoặc Combo Ngày gắn ngay trên đầu mỗi khung để đổi!', 155, 535);

    const demoImg = new Image();
    demoImg.onload = function() {
        state.currentImageName = 'studio_sang_tao.png';
        setWorkspaceImage(demoImg, 'studio_sang_tao.png');

        if (isInitial) {
            const deviceTag = getTagById('device');
            const objectTag = getTagById('object');

            const sampleBox1 = {
                id: Date.now(),
                tagId: deviceTag.id,
                label: deviceTag.name,
                date: getOffsetDateISO(0),
                note: 'MacBook Studio',
                x: 68,
                y: 152,
                width: 395,
                height: 258,
                color: deviceTag.color
            };
            const sampleBox2 = {
                id: Date.now() + 1,
                tagId: objectTag.id,
                label: objectTag.name,
                date: getOffsetDateISO(-1),
                note: 'Trà đào cam sả',
                x: 552,
                y: 205,
                width: 186,
                height: 182,
                color: objectTag.color
            };

            state.boundingBoxes.push(sampleBox1, sampleBox2);
            state.selectedBoxId = sampleBox1.id;
            state.boxCounter = 3;
            renderTagChoicesUI();
            syncAllViews();
        } else {
            showToast(t('toast_demo_loaded'), 'rose');
        }
    };
    demoImg.src = tempCanvas.toDataURL('image/png');
}
