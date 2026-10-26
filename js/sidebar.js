// ==========================================
// QUẢN LÝ DANH SÁCH KHUNG BÊN PHẢI (SIDEBAR)
// ==========================================

import { state, getTagById } from './state.js';
import { escapeHtml, formatDateVN, showToast } from './utils.js';
import { t, formatDate } from './i18n.js';
import { getCanvas } from './canvas.js';
import { renderTagChoicesUI } from './tags.js';
import { updateJsonPreview, copySingleBoxCoord } from './export.js';
import { syncAllViews } from './app.js';

let cachedEmptyState = null;

/**
 * Xóa bộ lọc ngày
 */
export function clearDateFilter() {
    const input = document.getElementById('filterDateInput');
    if (input) input.value = '';
    syncAllViews();
}

/**
 * Xử lý khi thay đổi bộ lọc Tag hoặc Ngày
 */
export function handleFilterChange() {
    syncAllViews();
}

/**
 * Hiển thị danh sách các thẻ tọa độ khung ở thanh Sidebar bên phải
 */
export function renderBoxList() {
    const container = document.getElementById('boxListContainer');
    const countBadge = document.getElementById('boxCountBadge');
    const coordFormatSelect = document.getElementById('coordFormatSelect');
    const filterTagSelect = document.getElementById('filterTagSelect');
    const filterDateInput = document.getElementById('filterDateInput');

    if (!container || !countBadge || !coordFormatSelect || !filterTagSelect || !filterDateInput) return;

    // Lưu lại phần tử empty state trước khi container bị xóa innerHTML
    if (!cachedEmptyState) {
        cachedEmptyState = document.getElementById('emptyBoxListState');
    }

    const formatMode = coordFormatSelect.value;
    const filterTagId = filterTagSelect.value;
    const filterDateVal = filterDateInput.value;

    const clearDateBtn = document.getElementById('btnClearDateFilter');
    if (clearDateBtn) {
        if (filterDateVal) clearDateBtn.classList.remove('hidden');
        else clearDateBtn.classList.add('hidden');
    }

    countBadge.textContent = state.boundingBoxes.length;

    const hasBoxes = state.boundingBoxes.length > 0;
    const btnUndo = document.getElementById('btnUndo');
    const btnClearAll = document.getElementById('btnClearAll');
    const btnCopyAll = document.getElementById('btnCopyAll');
    const btnExportJson = document.getElementById('btnExportJson');
    const btnExportExcel = document.getElementById('btnExportExcel');
    const btnDownloadImg = document.getElementById('btnDownloadImg');

    if (btnUndo) btnUndo.disabled = !hasBoxes;
    if (btnClearAll) btnClearAll.disabled = !hasBoxes;
    if (btnCopyAll) btnCopyAll.disabled = !hasBoxes;
    if (btnExportJson) btnExportJson.disabled = !hasBoxes;
    if (btnExportExcel) btnExportExcel.disabled = !hasBoxes;
    if (btnDownloadImg) btnDownloadImg.disabled = !state.currentImage;

    updateJsonPreview();

    if (!hasBoxes) {
        container.innerHTML = '';
        if (cachedEmptyState) {
            cachedEmptyState.classList.remove('hidden');
            container.appendChild(cachedEmptyState);
        }
        return;
    }

    container.innerHTML = '';

    state.boundingBoxes.forEach((box, idx) => {
        if (filterTagId !== 'ALL' && box.tagId !== filterTagId) return;
        if (filterDateVal && box.date !== filterDateVal) return;

        const isSelected = String(box.id) === String(state.selectedBoxId);
        const card = document.createElement('div');
        card.id = `box-card-${box.id}`;
        card.className = `p-3.5 rounded-2xl border-2 transition-all duration-150 ${
            isSelected 
                ? 'bg-white dark:bg-stone-800/95 border-rose-500 shadow-lg shadow-rose-500/10' 
                : 'bg-white/90 dark:bg-stone-800/80 border-orange-200/80 dark:border-stone-700 hover:border-orange-300 dark:hover:border-stone-600 shadow-sm'
        }`;

        card.addEventListener('click', (e) => {
            if (['INPUT', 'SELECT'].includes(e.target.tagName) || e.target.closest('button')) return;
            state.selectedBoxId = box.id;
            state.activeTagId = box.tagId; // Đồng bộ Tag đang chọn với khung này
            renderTagChoicesUI();          // Cập nhật lại thanh Tag chips & dropdown
            syncAllViews();
        });

        const tagOptionsHtml = state.tagChoices.map(t => 
            `<option value="${t.id}" ${t.id === box.tagId ? 'selected' : ''} class="text-stone-900 bg-white dark:bg-stone-800 dark:text-stone-100">${t.icon} ${escapeHtml(t.id)}-${escapeHtml(t.name)}</option>`
        ).join('');

        let coordCellsHtml = '';
        if (formatMode === 'xywh') {
            coordCellsHtml = `
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-extrabold">X</span>
                    <input type="number" value="${box.x}" onchange="updateBoxCoord('${box.id}', 'x', this.value)"
                           class="w-16 bg-transparent text-right font-mono text-xs font-extrabold text-rose-600 dark:text-rose-400 outline-none">
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-extrabold">Y</span>
                    <input type="number" value="${box.y}" onchange="updateBoxCoord('${box.id}', 'y', this.value)"
                           class="w-16 bg-transparent text-right font-mono text-xs font-extrabold text-rose-600 dark:text-rose-400 outline-none">
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-extrabold">${t('width_label')}</span>
                    <input type="number" value="${box.width}" onchange="updateBoxCoord('${box.id}', 'width', this.value)"
                           class="w-16 bg-transparent text-right font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400 outline-none">
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex items-center justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-extrabold">${t('height_label')}</span>
                    <input type="number" value="${box.height}" onchange="updateBoxCoord('${box.id}', 'height', this.value)"
                           class="w-16 bg-transparent text-right font-mono text-xs font-extrabold text-emerald-600 dark:text-emerald-400 outline-none">
                </div>
            `;
        } else if (formatMode === 'xyxy') {
            const xmax = box.x + box.width;
            const ymax = box.y + box.height;
            coordCellsHtml = `
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">Xmin:</span>
                    <span class="font-mono text-xs text-rose-600 dark:text-rose-400 font-extrabold">${box.x}</span>
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">Ymin:</span>
                    <span class="font-mono text-xs text-rose-600 dark:text-rose-400 font-extrabold">${box.y}</span>
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">Xmax:</span>
                    <span class="font-mono text-xs text-orange-600 dark:text-orange-400 font-extrabold">${xmax}</span>
                </div>
                <div class="bg-orange-50/70 dark:bg-stone-900/80 px-2.5 py-1.5 rounded-xl border border-orange-200/80 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">Ymax:</span>
                    <span class="font-mono text-xs text-orange-600 dark:text-orange-400 font-extrabold">${ymax}</span>
                </div>
            `;
        } else {
            const imgW = state.currentImage ? state.currentImage.naturalWidth : 1;
            const imgH = state.currentImage ? state.currentImage.naturalHeight : 1;
            const xCenter = ((box.x + box.width / 2) / imgW).toFixed(4);
            const yCenter = ((box.y + box.height / 2) / imgH).toFixed(4);
            const nw = (box.width / imgW).toFixed(4);
            const nh = (box.height / imgH).toFixed(4);
            coordCellsHtml = `
                <div class="bg-purple-50/70 dark:bg-stone-900/80 px-2 py-1.5 rounded-xl border border-purple-200 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">X_center:</span>
                    <span class="font-mono text-xs text-purple-600 dark:text-purple-400 font-extrabold">${xCenter}</span>
                </div>
                <div class="bg-purple-50/70 dark:bg-stone-900/80 px-2 py-1.5 rounded-xl border border-purple-200 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">Y_center:</span>
                    <span class="font-mono text-xs text-purple-600 dark:text-purple-400 font-extrabold">${yCenter}</span>
                </div>
                <div class="bg-purple-50/70 dark:bg-stone-900/80 px-2 py-1.5 rounded-xl border border-purple-200 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">W_norm:</span>
                    <span class="font-mono text-xs text-purple-600 dark:text-purple-400 font-extrabold">${nw}</span>
                </div>
                <div class="bg-purple-50/70 dark:bg-stone-900/80 px-2 py-1.5 rounded-xl border border-purple-200 dark:border-stone-700 flex justify-between">
                    <span class="text-[10px] text-stone-500 dark:text-stone-400 font-bold">H_norm:</span>
                    <span class="font-mono text-xs text-purple-600 dark:text-purple-400 font-extrabold">${nh}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <!-- Hàng 1: STT + Combo chọn Tag + Nút thao tác -->
            <div class="flex items-center justify-between gap-2 mb-2">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                    <span class="w-6 h-6 rounded-xl flex items-center justify-center text-[11px] font-mono font-extrabold text-white shrink-0 shadow-sm"
                          style="background-color: ${box.color}">
                        ${idx + 1}
                    </span>
                    <select onchange="updateBoxTag('${box.id}', this.value)"
                            class="bg-orange-50/60 dark:bg-stone-900 border border-orange-200 dark:border-stone-700 focus:border-rose-500 rounded-xl px-2.5 py-1 text-xs font-bold text-stone-800 dark:text-stone-100 w-full outline-none transition cursor-pointer">
                        ${tagOptionsHtml}
                    </select>
                </div>

                <div class="flex items-center gap-1 shrink-0">
                    <button onclick="copySingleBoxCoord('${box.id}')"
                            class="p-1.5 text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-stone-700 rounded-xl transition cursor-pointer"
                            title="${t('card_copy_btn_title')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                    </button>
                    <button onclick="deleteBox('${box.id}')"
                            class="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-stone-700 rounded-xl transition cursor-pointer"
                            title="${t('card_delete_btn_title')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Hàng 2: Combo chọn Ngày nhanh + Lịch Ngày tháng -->
            <div class="grid grid-cols-12 gap-1.5 mb-2">
                <div class="col-span-7 flex items-center gap-1 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 rounded-xl px-2 py-1">
                    <span class="text-[11px]">📅</span>
                    <input type="date" value="${box.date || state.defaultBoxDate}"
                           onchange="updateBoxDate('${box.id}', this.value)"
                           class="bg-transparent text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 outline-none w-full cursor-pointer">
                </div>
                <div class="col-span-5">
                    <select onchange="handleInlineDatePresetChange('${box.id}', this.value)"
                            class="w-full h-full bg-amber-50/80 dark:bg-stone-900 border border-amber-200 dark:border-stone-700 rounded-xl px-2 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-400 outline-none cursor-pointer">
                        <option value="custom">⚡ ${t('preset_custom')}</option>
                        <option value="today">${t('preset_today')}</option>
                        <option value="yesterday">${t('preset_yesterday')}</option>
                        <option value="3days">${t('preset_3days')}</option>
                        <option value="week">${t('preset_week')}</option>
                        <option value="tomorrow">${t('preset_tomorrow')}</option>
                    </select>
                </div>
            </div>

            <div class="mb-2">
                <input type="text" value="${escapeHtml(box.note || '')}"
                       onchange="updateBoxNote('${box.id}', this.value)"
                       placeholder="${t('card_note_placeholder')}"
                       class="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200/90 dark:border-stone-700 focus:border-rose-400 rounded-xl px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:text-stone-200 outline-none transition">
            </div>

            <!-- Hàng 3: Tọa độ X, Y, W, H -->
            <div class="grid grid-cols-2 gap-1.5">
                ${coordCellsHtml}
            </div>
        `;

        container.appendChild(card);
    });
}

/**
 * Cuộn thanh cuộn tới thẻ khung vừa chọn
 * @param {number|string} id
 */
export function scrollToBoxCard(id) {
    const el = document.getElementById(`box-card-${id}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Đổi Tag cho khung đã chọn và đồng bộ ngay lập tức sang mọi view
 * @param {number|string} boxId
 * @param {string} newTagId
 */
export function updateBoxTag(boxId, newTagId) {
    const box = state.boundingBoxes.find(b => String(b.id) === String(boxId));
    const tag = getTagById(newTagId);
    if (box && tag) {
        box.tagId = tag.id;
        box.label = tag.name;
        box.color = tag.color;
        state.selectedBoxId = box.id;
        state.activeTagId = tag.id; // Đồng bộ luôn activeTagId
        renderTagChoicesUI();
        syncAllViews();
        showToast(t('toast_tag_updated'), 'emerald');
    }
}

/**
 * Cập nhật ngày cho khung đã chọn
 * @param {number|string} boxId
 * @param {string} newIsoDate
 */
export function updateBoxDate(boxId, newIsoDate) {
    const box = state.boundingBoxes.find(b => String(b.id) === String(boxId));
    if (box && newIsoDate) {
        box.date = newIsoDate;
        state.selectedBoxId = box.id;
        syncAllViews();
        showToast(`${t('default_date_label')} ${formatDate(newIsoDate)}`, 'orange');
    }
}

/**
 * Cập nhật ghi chú cho khung
 * @param {number|string} id
 * @param {string} newNote
 */
export function updateBoxNote(id, newNote) {
    const box = state.boundingBoxes.find(b => String(b.id) === String(id));
    if (box) {
        box.note = newNote.trim();
        syncAllViews();
    }
}

/**
 * Cập nhật thủ công một tọa độ (x, y, width, height) từ ô nhập liệu trong Sidebar
 * @param {number|string} id
 * @param {'x'|'y'|'width'|'height'} field
 * @param {string|number} val
 */
export function updateBoxCoord(id, field, val) {
    const box = state.boundingBoxes.find(b => String(b.id) === String(id));
    const canvas = getCanvas();
    if (!box || !state.currentImage || !canvas) return;

    let num = parseInt(val, 10);
    if (isNaN(num)) num = 0;

    if (field === 'x') box.x = Math.max(0, Math.min(canvas.width - 1, num));
    if (field === 'y') box.y = Math.max(0, Math.min(canvas.height - 1, num));
    if (field === 'width') box.width = Math.max(1, Math.min(canvas.width - box.x, num));
    if (field === 'height') box.height = Math.max(1, Math.min(canvas.height - box.y, num));

    syncAllViews();
}

/**
 * Xóa một khung theo ID
 * @param {number|string} id
 */
export function deleteBox(id) {
    state.boundingBoxes = state.boundingBoxes.filter(b => String(b.id) !== String(id));
    if (String(state.selectedBoxId) === String(id)) state.selectedBoxId = null;
    if (String(state.hoveredBoxId) === String(id)) state.hoveredBoxId = null;
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_box_deleted'), 'rose');
}

/**
 * Hoàn tác khung vừa vẽ cuối cùng
 */
export function undoLastBox() {
    if (state.boundingBoxes.length === 0) return;
    const removed = state.boundingBoxes.pop();
    if (String(state.selectedBoxId) === String(removed.id)) state.selectedBoxId = null;
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_box_undone'), 'orange');
}

/**
 * Xóa toàn bộ các khung trên ảnh
 */
export function clearAllBoxes() {
    if (state.boundingBoxes.length === 0) return;
    state.boundingBoxes = [];
    state.selectedBoxId = null;
    state.hoveredBoxId = null;
    state.boxCounter = 1;
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_all_cleared'), 'rose');
}
