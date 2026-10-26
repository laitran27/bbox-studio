// =========================================================================
// LỚP OVERLAY DOM (#bboxOverlayLayer): GẮN COMBO CHỌN TAG & COMBO NGÀY
// TRỰC TIẾP NGAY TRÊN TỪNG KHUNG HÌNH TRÊN BỨC ẢNH
// =========================================================================

import { state } from './state.js';
import { hexToRgba, escapeHtml, detectDatePresetValue, getOffsetDateISO } from './utils.js';
import { getCanvas } from './canvas.js';
import { startBoxMove, startBoxResize } from './interaction.js';
import { updateBoxDate } from './sidebar.js';
import { t } from './i18n.js';

let bboxOverlayLayer = null;

export function initOverlayLayer() {
    bboxOverlayLayer = document.getElementById('bboxOverlayLayer');
}

/**
 * Hiển thị toàn bộ các khung overlay DOM đè lên Canvas
 */
export function renderOverlayBoxes() {
    if (!bboxOverlayLayer) initOverlayLayer();
    const canvas = getCanvas();

    if (!state.currentImage || !bboxOverlayLayer || !canvas) {
        if (bboxOverlayLayer) bboxOverlayLayer.innerHTML = '';
        return;
    }

    const showInlineCombosToggle = document.getElementById('showInlineCombosToggle');
    const showInlineCombos = showInlineCombosToggle ? showInlineCombosToggle.checked : true;

    const filterTagSelect = document.getElementById('filterTagSelect');
    const filterDateInput = document.getElementById('filterDateInput');
    const filterTagId = filterTagSelect ? filterTagSelect.value : 'ALL';
    const filterDateVal = filterDateInput ? filterDateInput.value : '';

    bboxOverlayLayer.innerHTML = '';

    state.boundingBoxes.forEach((box, idx) => {
        const isTagFiltered = filterTagId !== 'ALL' && box.tagId !== filterTagId;
        const isDateFiltered = filterDateVal && box.date !== filterDateVal;
        if (isTagFiltered || isDateFiltered) return;

        const isSelected = String(box.id) === String(state.selectedBoxId);
        const leftPct = (box.x / canvas.width) * 100;
        const topPct = (box.y / canvas.height) * 100;
        const widthPct = (box.width / canvas.width) * 100;
        const heightPct = (box.height / canvas.height) * 100;

        // Nếu khung nằm quá sát mép trên của bức ảnh (< 42px), đặt thanh Combo nằm bên trong mép trên của khung
        const placeInsideTop = box.y < 42;

        const boxEl = document.createElement('div');
        boxEl.id = `overlay-box-${box.id}`;
        boxEl.className = `absolute pointer-events-auto group transition-shadow ${
            isSelected ? 'z-30' : 'z-20 hover:z-30'
        }`;
        boxEl.style.left = `${leftPct}%`;
        boxEl.style.top = `${topPct}%`;
        boxEl.style.width = `${widthPct}%`;
        boxEl.style.height = `${heightPct}%`;
        boxEl.style.border = `${isSelected ? '3px' : '2px'} solid ${box.color}`;
        boxEl.style.backgroundColor = hexToRgba(box.color, isSelected ? 0.16 : 0.08);
        boxEl.style.borderRadius = '6px';
        boxEl.style.cursor = 'move';

        // Kéo khung để di chuyển
        boxEl.addEventListener('mousedown', (e) => startBoxMove(e, box.id));

        // Danh sách <option> cho Combo chọn Tag trực tiếp trên khung (định dạng ID-Tên tag)
        const tagOptionsHtml = state.tagChoices.map(t => 
            `<option value="${t.id}" ${t.id === box.tagId ? 'selected' : ''} class="text-stone-900 bg-white font-bold">${t.icon} ${escapeHtml(t.id)}-${escapeHtml(t.name)}</option>`
        ).join('');

        // Thanh Header Bar gắn trực tiếp trên khung hình: chỉ hiển thị số thứ tự, nhãn Tag (ID-Tên tag) và nút xóa
        const toolbarPositionClass = placeInsideTop 
            ? 'top-1 left-1' 
            : '-top-7 left-0';

        const inlineComboHtml = showInlineCombos ? `
            <div class="inline-box-toolbar absolute ${toolbarPositionClass} flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-white whitespace-nowrap pointer-events-auto cursor-default shadow-md"
                 style="background-color: ${box.color};"
                 onmousedown="event.stopPropagation()">
                
                <!-- Số thứ tự khung -->
                <span class="px-1.5 py-0.5 rounded-md bg-black/25 text-[10px] font-mono font-extrabold tracking-tighter">
                    #${idx + 1}
                </span>

                <!-- DROPDOWN CHỌN & ĐỔI TAG TRỰC TIẾP TRÊN KHUNG (ID-Tên tag) -->
                <select onchange="updateBoxTag('${box.id}', this.value)"
                        title="${t('box_num', { num: idx + 1 })}"
                        class="bg-white/95 hover:bg-white text-stone-900 rounded-md px-1.5 py-0.5 text-[11px] font-extrabold outline-none cursor-pointer shadow-sm border border-white/60 max-w-[190px]">
                    ${tagOptionsHtml}
                </select>

                <!-- Nút xóa nhanh khung ngay trên ảnh -->
                <button type="button" onclick="deleteBox('${box.id}')"
                        title="${t('card_delete_btn_title')}"
                        class="w-5 h-5 rounded-md bg-black/25 hover:bg-black/45 text-white flex items-center justify-center text-[11px] font-bold transition cursor-pointer ml-0.5">
                    ✕
                </button>
            </div>
        ` : '';

        // 4 góc kéo thay đổi kích thước khung
        const resizeHandlesHtml = `
            <div class="resize-handle -top-1.5 -left-1.5 cursor-nwse-resize" style="color: ${box.color}" onmousedown="startBoxResize(event, '${box.id}', 'nw')"></div>
            <div class="resize-handle -top-1.5 -right-1.5 cursor-nesw-resize" style="color: ${box.color}" onmousedown="startBoxResize(event, '${box.id}', 'ne')"></div>
            <div class="resize-handle -bottom-1.5 -left-1.5 cursor-nesw-resize" style="color: ${box.color}" onmousedown="startBoxResize(event, '${box.id}', 'sw')"></div>
            <div class="resize-handle -bottom-1.5 -right-1.5 cursor-nwse-resize" style="color: ${box.color}" onmousedown="startBoxResize(event, '${box.id}', 'se')"></div>
        `;

        // Nhãn tọa độ nhỏ ở góc dưới phải của khung
        const bottomCoordBadgeHtml = `
            <div class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-stone-900/75 text-white font-mono text-[9px] font-bold pointer-events-none">
                ${box.width}×${box.height}px
            </div>
        `;

        boxEl.innerHTML = inlineComboHtml + resizeHandlesHtml + bottomCoordBadgeHtml;
        bboxOverlayLayer.appendChild(boxEl);
    });
}

/**
 * Cập nhật mượt vị trí phần tử DOM khi đang kéo di chuyển hoặc co giãn
 * @param {object} box
 */
export function updateSingleOverlayBoxPosition(box) {
    const el = document.getElementById(`overlay-box-${box.id}`);
    const canvas = getCanvas();
    if (!el || !state.currentImage || !canvas) return;

    el.style.left = `${(box.x / canvas.width) * 100}%`;
    el.style.top = `${(box.y / canvas.height) * 100}%`;
    el.style.width = `${(box.width / canvas.width) * 100}%`;
    el.style.height = `${(box.height / canvas.height) * 100}%`;
}

/**
 * Đổi ngày của khung khi người dùng chọn một preset nhanh
 * @param {number|string} boxId
 * @param {string} preset
 */
export function handleInlineDatePresetChange(boxId, preset) {
    if (preset === 'custom') return;
    let newDate = state.defaultBoxDate;
    if (preset === 'today') newDate = getOffsetDateISO(0);
    else if (preset === 'yesterday') newDate = getOffsetDateISO(-1);
    else if (preset === '3days') newDate = getOffsetDateISO(-3);
    else if (preset === 'week') newDate = getOffsetDateISO(-7);
    else if (preset === 'tomorrow') newDate = getOffsetDateISO(1);
    updateBoxDate(boxId, newDate);
}
