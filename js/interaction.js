// ==========================================
// TỌA ĐỘ CHUỘT & KÉO VẼ / DI CHUYỂN / CO GIÃN KHUNG
// ==========================================

import { state, getTagById } from './state.js';
import { getCanvas, redrawCanvas, updateCanvasDisplaySize, loadImageFromFile, handleFileSelect } from './canvas.js';
import { updateSingleOverlayBoxPosition } from './overlay.js';
import { renderTagChoicesUI, setActiveTag } from './tags.js';
import { scrollToBoxCard, updateBoxTag, deleteBox, undoLastBox } from './sidebar.js';
import { formatDateVN, getOffsetDateISO, detectDatePresetValue, showToast } from './utils.js';
import { syncAllViews } from './app.js';

/**
 * Chuyển đổi tọa độ chuột từ màn hình sang tọa độ pixel ảnh gốc
 * @param {MouseEvent|Touch} clientEvent
 * @returns {{x: number, y: number}}
 */
export function getImageCoordinates(clientEvent) {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let rawX = (clientEvent.clientX - rect.left) * scaleX;
    let rawY = (clientEvent.clientY - rect.top) * scaleY;

    const x = Math.max(0, Math.min(canvas.width, Math.round(rawX)));
    const y = Math.max(0, Math.min(canvas.height, Math.round(rawY)));

    return { x, y };
}

/**
 * Bắt đầu kéo vẽ khung mới trên nền Canvas
 * @param {MouseEvent|Touch} e
 */
export function handleCanvasPointerDown(e) {
    if (!state.currentImage) return;
    if (e.button !== undefined && e.button !== 0) return;

    state.interactionMode = 'draw';
    state.startCoords = getImageCoordinates(e);
    state.currentCoords = { ...state.startCoords };

    const badge = document.getElementById('liveDrawingBadge');
    if (badge) {
        badge.classList.remove('hidden');
        badge.classList.add('flex');
    }
}

/**
 * Bắt đầu kéo di chuyển khung đã có trực tiếp trên ảnh
 * @param {MouseEvent} e
 * @param {number|string} boxId
 */
export function startBoxMove(e, boxId) {
    if (e.button !== undefined && e.button !== 0) return;
    // Không kích hoạt kéo nếu người dùng đang bấm vào thẻ <select>, <input> hoặc <button> trên thanh Combo
    if (['SELECT', 'INPUT', 'BUTTON', 'OPTION'].includes(e.target.tagName)) return;

    e.stopPropagation();
    const box = state.boundingBoxes.find(b => String(b.id) === String(boxId));
    if (!box) return;

    state.selectedBoxId = box.id;
    state.activeTagId = box.tagId; // Đồng bộ luôn tag đang chọn
    state.interactionMode = 'move';
    state.interactingBoxId = box.id;
    state.startCoords = getImageCoordinates(e);
    state.initialBoxRect = { x: box.x, y: box.y, width: box.width, height: box.height };

    renderTagChoicesUI();
    syncAllViews();
    scrollToBoxCard(box.id);
}

/**
 * Bắt đầu kéo góc thay đổi kích thước khung trực tiếp trên ảnh
 * @param {MouseEvent} e
 * @param {number|string} boxId
 * @param {'nw'|'ne'|'sw'|'se'} handleDir
 */
export function startBoxResize(e, boxId, handleDir) {
    if (e.button !== undefined && e.button !== 0) return;
    e.stopPropagation();
    const box = state.boundingBoxes.find(b => String(b.id) === String(boxId));
    if (!box) return;

    state.selectedBoxId = box.id;
    state.activeTagId = box.tagId; // Đồng bộ luôn tag đang chọn
    state.interactionMode = 'resize';
    state.activeResizeHandle = handleDir;
    state.interactingBoxId = box.id;
    state.startCoords = getImageCoordinates(e);
    state.initialBoxRect = { x: box.x, y: box.y, width: box.width, height: box.height };

    renderTagChoicesUI();
    syncAllViews();
}

/**
 * Xử lý di chuyển chuột / cảm ứng toàn cục
 * @param {MouseEvent|Touch} e
 */
export function handleGlobalPointerMove(e) {
    if (!state.currentImage) return;

    const canvas = getCanvas();
    const coords = getImageCoordinates(e);
    const cursorCoordsEl = document.getElementById('liveCursorCoords');
    if (cursorCoordsEl) cursorCoordsEl.textContent = `X: ${coords.x}, Y: ${coords.y}`;

    if (!state.interactionMode) return;

    state.currentCoords = coords;

    if (state.interactionMode === 'draw') {
        const w = Math.abs(state.currentCoords.x - state.startCoords.x);
        const h = Math.abs(state.currentCoords.y - state.startCoords.y);
        const dragDimsEl = document.getElementById('liveDragDimensions');
        if (dragDimsEl) dragDimsEl.textContent = `W: ${w}, H: ${h}`;
        redrawCanvas();
    } else if (state.interactionMode === 'move') {
        const box = state.boundingBoxes.find(b => String(b.id) === String(state.interactingBoxId));
        if (!box || !state.initialBoxRect) return;
        const dx = state.currentCoords.x - state.startCoords.x;
        const dy = state.currentCoords.y - state.startCoords.y;

        box.x = Math.max(0, Math.min(canvas.width - box.width, state.initialBoxRect.x + dx));
        box.y = Math.max(0, Math.min(canvas.height - box.height, state.initialBoxRect.y + dy));

        redrawCanvas();
        updateSingleOverlayBoxPosition(box);
    } else if (state.interactionMode === 'resize') {
        const box = state.boundingBoxes.find(b => String(b.id) === String(state.interactingBoxId));
        if (!box || !state.initialBoxRect) return;

        let x1 = state.initialBoxRect.x;
        let y1 = state.initialBoxRect.y;
        let x2 = state.initialBoxRect.x + state.initialBoxRect.width;
        let y2 = state.initialBoxRect.y + state.initialBoxRect.height;

        if (state.activeResizeHandle.includes('w')) x1 = Math.min(x2 - 12, state.currentCoords.x);
        if (state.activeResizeHandle.includes('e')) x2 = Math.max(x1 + 12, state.currentCoords.x);
        if (state.activeResizeHandle.includes('n')) y1 = Math.min(y2 - 12, state.currentCoords.y);
        if (state.activeResizeHandle.includes('s')) y2 = Math.max(y1 + 12, state.currentCoords.y);

        box.x = Math.max(0, x1);
        box.y = Math.max(0, y1);
        box.width = Math.min(canvas.width - box.x, x2 - box.x);
        box.height = Math.min(canvas.height - box.y, y2 - box.y);

        redrawCanvas();
        updateSingleOverlayBoxPosition(box);
    }
}

/**
 * Xử lý nhả chuột / cảm ứng kết thúc thao tác
 */
export function handleGlobalPointerUp() {
    if (!state.interactionMode || !state.currentImage) return;

    if (state.interactionMode === 'draw') {
        const badge = document.getElementById('liveDrawingBadge');
        if (badge) {
            badge.classList.add('hidden');
            badge.classList.remove('flex');
        }

        const x = Math.min(state.startCoords.x, state.currentCoords.x);
        const y = Math.min(state.startCoords.y, state.currentCoords.y);
        const width = Math.abs(state.currentCoords.x - state.startCoords.x);
        const height = Math.abs(state.currentCoords.y - state.startCoords.y);

        state.interactionMode = null;

        // Nếu click nhẹ vào khoảng trắng trên ảnh (kéo < 8px) thì bỏ chọn khung hiện tại
        if (width < 8 || height < 8) {
            state.selectedBoxId = null;
            renderTagChoicesUI();
            syncAllViews();
            return;
        }

        const activeTag = getTagById(state.activeTagId);
        const newBox = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            tagId: activeTag.id,
            label: activeTag.name,
            date: state.defaultBoxDate,
            note: '',
            x: x,
            y: y,
            width: width,
            height: height,
            color: activeTag.color
        };

        state.boxCounter++;
        state.boundingBoxes.push(newBox);
        state.selectedBoxId = newBox.id;

        renderTagChoicesUI();
        syncAllViews();
        scrollToBoxCard(newBox.id);
        showToast(`Đã tạo khung #${state.boundingBoxes.length} • Bạn có thể đổi Tag & Ngày ngay trên khung!`, 'emerald');
    } else {
        state.interactionMode = null;
        state.interactingBoxId = null;
        state.activeResizeHandle = null;
        state.initialBoxRect = null;
        syncAllViews();
    }
}

/**
 * Xử lý đổi mốc ngày mặc định từ Preset
 * @param {string} preset
 */
export function handleDefaultDatePresetChange(preset) {
    if (preset === 'today') state.defaultBoxDate = getOffsetDateISO(0);
    else if (preset === 'yesterday') state.defaultBoxDate = getOffsetDateISO(-1);
    else if (preset === '3days') state.defaultBoxDate = getOffsetDateISO(-3);
    else if (preset === 'week') state.defaultBoxDate = getOffsetDateISO(-7);
    else if (preset === 'tomorrow') state.defaultBoxDate = getOffsetDateISO(1);

    const input = document.getElementById('defaultDateInput');
    if (input) input.value = state.defaultBoxDate;
    showToast(`Ngày mặc định cho khung mới: ${formatDateVN(state.defaultBoxDate)}`, 'orange');
}

/**
 * Xử lý đổi ngày mặc định thủ công từ input date
 * @param {string} val
 */
export function handleDefaultDateManualChange(val) {
    if (!val) return;
    state.defaultBoxDate = val;
    const combo = document.getElementById('defaultDatePresetCombo');
    if (combo) combo.value = detectDatePresetValue(val);
    showToast(`Ngày mặc định cho khung mới: ${formatDateVN(state.defaultBoxDate)}`, 'orange');
}

/**
 * Đăng ký tất cả các sự kiện toàn cục: chuột, cảm ứng, bàn phím, kéo thả file
 */
export function setupEventListeners() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);

    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadImageFromFile(e.dataTransfer.files[0]);
        }
    });

    const canvas = getCanvas();
    if (canvas) {
        canvas.addEventListener('mousedown', handleCanvasPointerDown);
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.preventDefault();
                handleCanvasPointerDown(e.touches[0]);
            }
        }, { passive: false });
    }

    window.addEventListener('mousemove', handleGlobalPointerMove);
    window.addEventListener('mouseup', handleGlobalPointerUp);

    window.addEventListener('touchmove', (e) => {
        if (state.interactionMode && e.touches.length === 1) {
            e.preventDefault();
            handleGlobalPointerMove(e.touches[0]);
        }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
        if (state.interactionMode) {
            handleGlobalPointerUp(e.changedTouches[0]);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key >= '1' && e.key <= '9') {
            const idx = parseInt(e.key, 10) - 1;
            if (state.tagChoices[idx]) {
                e.preventDefault();
                setActiveTag(state.tagChoices[idx].id);
            }
            return;
        }

        if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedBoxId !== null) {
            deleteBox(state.selectedBoxId);
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
            e.preventDefault();
            undoLastBox();
        }
    });

    window.addEventListener('resize', () => {
        if (state.currentImage) updateCanvasDisplaySize();
    });
}
