// ==========================================
// XUẤT/NHẬP DỮ LIỆU JSON, EXCEL (DATABASE) & LƯU ẢNH CÓ KHUNG
// ==========================================

import { state, getTagById } from './state.js';
import { formatDateVN, copyTextSafe, showToast } from './utils.js';
import { t, formatDate, getCurrentLanguage } from './i18n.js';
import { getCanvas, redrawCanvas } from './canvas.js';
import { renderTagChoicesUI, saveTagsToStorage } from './tags.js';
import { syncAllViews } from './app.js';

/**
 * Tạo dữ liệu xuất đầy đủ gồm thông tin ảnh, danh sách khung, tọa độ và chuẩn hóa YOLO
 * @returns {object} Cấu trúc JSON chuẩn hóa
 */
export function getFormattedExportData() {
    const canvas = getCanvas();
    const imgW = state.currentImage ? state.currentImage.naturalWidth : 0;
    const imgH = state.currentImage ? state.currentImage.naturalHeight : 0;

    return {
        image_name: state.currentImageName,
        image_width: imgW,
        image_height: imgH,
        total_boxes: state.boundingBoxes.length,
        categories: state.tagChoices.map(t => ({
            id: t.id,
            class_id: t.classId,
            name: t.name,
            color: t.color,
            icon: t.icon
        })),
        annotations: state.boundingBoxes.map((b, index) => {
            const tag = getTagById(b.tagId);
            return {
                index: index + 1,
                tag_id: tag.id,
                class_id: tag.classId,
                tag_name: tag.name,
                date_iso: b.date || state.defaultBoxDate,
                date_vn: formatDateVN(b.date || state.defaultBoxDate),
                note: b.note || '',
                coordinates: {
                    x: b.x,
                    y: b.y,
                    width: b.width,
                    height: b.height,
                    xmax: b.x + b.width,
                    ymax: b.y + b.height
                },
                yolo_normalized: imgW && imgH ? {
                    class_id: tag.classId,
                    x_center: Number(((b.x + b.width / 2) / imgW).toFixed(4)),
                    y_center: Number(((b.y + b.height / 2) / imgH).toFixed(4)),
                    width: Number((b.width / imgW).toFixed(4)),
                    height: Number((b.height / imgH).toFixed(4))
                } : null
            };
        })
    };
}

/**
 * Tạo mảng dữ liệu dạng bảng (Tabular Rows) chuẩn hóa để xuất Excel hoặc import Database
 * @param {Array<string>} [selectedColumns] - Mảng các tên cột cần lấy (mặc định lấy tất cả)
 * @returns {Array<object>} Danh sách các dòng dữ liệu với tên cột rõ ràng
 */
export function generateDatabaseRows(selectedColumns = null) {
    const imgW = state.currentImage ? state.currentImage.naturalWidth : 0;
    const imgH = state.currentImage ? state.currentImage.naturalHeight : 0;
    const nowISO = new Date().toISOString();

    const fullRows = state.boundingBoxes.map((b, index) => {
        const tag = getTagById(b.tagId);
        const xmax = b.x + b.width;
        const ymax = b.y + b.height;
        const xCenter = imgW ? Number(((b.x + b.width / 2) / imgW).toFixed(4)) : null;
        const yCenter = imgH ? Number(((b.y + b.height / 2) / imgH).toFixed(4)) : null;
        const wNorm = imgW ? Number((b.width / imgW).toFixed(4)) : null;
        const hNorm = imgH ? Number((b.height / imgH).toFixed(4)) : null;

        return {
            "ID": String(b.id),
            "STT": index + 1,
            "IMAGE_NAME": state.currentImageName,
            "IMAGE_WIDTH": imgW,
            "IMAGE_HEIGHT": imgH,
            "TAG_ID": tag.id,
            "CLASS_ID": tag.classId,
            "TAG_NAME": tag.name,
            "TAG_ICON": tag.icon,
            "DATE_ISO": b.date || state.defaultBoxDate,
            "DATE_VN": formatDateVN(b.date || state.defaultBoxDate),
            "NOTE": b.note || '',
            "X": b.x,
            "Y": b.y,
            "WIDTH": b.width,
            "HEIGHT": b.height,
            "X_MAX": xmax,
            "Y_MAX": ymax,
            "X_CENTER_NORM": xCenter,
            "Y_CENTER_NORM": yCenter,
            "WIDTH_NORM": wNorm,
            "HEIGHT_NORM": hNorm,
            "CREATED_AT": nowISO
        };
    });

    if (Array.isArray(selectedColumns) && selectedColumns.length > 0) {
        return fullRows.map(row => {
            const filtered = {};
            selectedColumns.forEach(key => {
                if (key in row) filtered[key] = row[key];
            });
            return filtered;
        });
    }

    return fullRows;
}

/**
 * Cập nhật giao diện xem trước JSON ở Sidebar và Modal phóng to
 */
export function updateJsonPreview() {
    const quickPreview = document.getElementById('jsonQuickPreview');
    const fullModalContent = document.getElementById('jsonFullModalContent');
    if (!quickPreview || !fullModalContent) return;

    const conciseList = state.boundingBoxes.map((b, idx) => {
        const tag = getTagById(b.tagId);
        return {
            stt: idx + 1,
            tag: tag.name,
            ngay: formatDateVN(b.date || state.defaultBoxDate),
            ...(b.note ? { note: b.note } : {}),
            x: b.x,
            y: b.y,
            width: b.width,
            height: b.height
        };
    });

    quickPreview.textContent = JSON.stringify(conciseList, null, 2);
    fullModalContent.textContent = JSON.stringify(getFormattedExportData(), null, 2);
}

/**
 * Sao chép tọa độ và thông tin của 1 khung duy nhất
 * @param {number|string} id
 */
export function copySingleBoxCoord(id) {
    const box = state.boundingBoxes.find(b => String(b.id) === String(id));
    if (!box) return;
    const tag = getTagById(box.tagId);
    const payload = JSON.stringify({
        tag_id: tag.id,
        tag_name: tag.name,
        date_iso: box.date || state.defaultBoxDate,
        date_vn: formatDateVN(box.date || state.defaultBoxDate),
        ...(box.note ? { note: box.note } : {}),
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
    });
    copyTextSafe(payload, t('toast_copied_single', { tag: tag.name, date: formatDate(box.date) }));
}

/**
 * Sao chép toàn bộ dữ liệu JSON vào Clipboard
 */
export function copyAllCoordsToClipboard() {
    const jsonStr = JSON.stringify(getFormattedExportData(), null, 2);
    copyTextSafe(jsonStr, t('toast_copied_all', { count: state.boundingBoxes.length }));
}

/**
 * Tải xuống tệp .json chứa dữ liệu đóng khung
 */
export function downloadJsonFile() {
    if (state.boundingBoxes.length === 0) {
        showToast(t('toast_no_boxes_json'), 'rose');
        return;
    }
    const jsonStr = JSON.stringify(getFormattedExportData(), null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const baseName = state.currentImageName.replace(/\.[^/.]+$/, '') || 'toa_do_anh';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_coordinates.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(t('toast_json_downloaded'), 'emerald');
}

// ==========================================
// CẤU HÌNH CÁC CỘT DỮ LIỆU XUẤT EXCEL & DATABASE
// ==========================================

export const EXCEL_COLUMN_DEFINITIONS = [
    // Identifiers & Tags
    { key: 'ID', group: 'tags', label_vi: 'Mã ID duy nhất (UUID/Timestamp)', label_en: 'Unique Box ID (UUID/Timestamp)', label_zh: '唯一标号 ID (UUID/时间戳)' },
    { key: 'STT', group: 'tags', label_vi: 'Số thứ tự khung (1, 2, 3...)', label_en: 'Order index (1, 2, 3...)', label_zh: '序号 (1, 2, 3...)' },
    { key: 'TAG_NAME', group: 'tags', label_vi: 'Tên Tag hiển thị (Người, Xe cộ...)', label_en: 'Tag Name (Person, Vehicle...)', label_zh: '标签名称 (Person, Vehicle...)' },
    { key: 'TAG_ID', group: 'tags', label_vi: 'Mã định danh Tag (slug)', label_en: 'Tag ID key (slug)', label_zh: '标签标识符 (slug)' },
    { key: 'CLASS_ID', group: 'tags', label_vi: 'ID lớp số nguyên (0, 1, 2...)', label_en: 'Class ID integer (0, 1, 2...)', label_zh: '类别编号 (0, 1, 2...)' },
    { key: 'TAG_ICON', group: 'tags', label_vi: 'Biểu tượng Tag (Icon)', label_en: 'Tag Icon emoji', label_zh: '标签图标' },

    // Dates & Notes
    { key: 'DATE_ISO', group: 'meta', label_vi: 'Ngày chuẩn ISO (YYYY-MM-DD)', label_en: 'Date ISO (YYYY-MM-DD)', label_zh: 'ISO 日期 (YYYY-MM-DD)' },
    { key: 'DATE_VN', group: 'meta', label_vi: 'Ngày chuẩn VN (DD/MM/YYYY)', label_en: 'Date VN (DD/MM/YYYY)', label_zh: '越南格式日期 (DD/MM/YYYY)' },
    { key: 'NOTE', group: 'meta', label_vi: 'Ghi chú chi tiết cho khung', label_en: 'Annotation Note', label_zh: '标注详细备注' },
    { key: 'CREATED_AT', group: 'meta', label_vi: 'Thời điểm tạo dòng (ISO)', label_en: 'Created Timestamp (ISO)', label_zh: '创建时间戳 (ISO)' },

    // Pixel Coordinates
    { key: 'X', group: 'pixel', label_vi: 'Tọa độ X góc trái trên (px)', label_en: 'Top-left X (px)', label_zh: '左上角 X 坐标 (px)' },
    { key: 'Y', group: 'pixel', label_vi: 'Tọa độ Y góc trái trên (px)', label_en: 'Top-left Y (px)', label_zh: '左上角 Y 坐标 (px)' },
    { key: 'WIDTH', group: 'pixel', label_vi: 'Chiều rộng khung (px)', label_en: 'Bounding Box Width (px)', label_zh: '标注框宽度 (px)' },
    { key: 'HEIGHT', group: 'pixel', label_vi: 'Chiều cao khung (px)', label_en: 'Bounding Box Height (px)', label_zh: '标注框高度 (px)' },
    { key: 'X_MAX', group: 'pixel', label_vi: 'Tọa độ X góc phải dưới (px)', label_en: 'Bottom-right Xmax (px)', label_zh: '右下角 Xmax (px)' },
    { key: 'Y_MAX', group: 'pixel', label_vi: 'Tọa độ Y góc phải dưới (px)', label_en: 'Bottom-right Ymax (px)', label_zh: '右下角 Ymax (px)' },

    // YOLO Normalized
    { key: 'X_CENTER_NORM', group: 'yolo', label_vi: 'Tâm X chuẩn hóa YOLO (0-1)', label_en: 'YOLO Normalized X Center (0-1)', label_zh: 'YOLO 归一化中心 X (0-1)' },
    { key: 'Y_CENTER_NORM', group: 'yolo', label_vi: 'Tâm Y chuẩn hóa YOLO (0-1)', label_en: 'YOLO Normalized Y Center (0-1)', label_zh: 'YOLO 归一化中心 Y (0-1)' },
    { key: 'WIDTH_NORM', group: 'yolo', label_vi: 'Chiều rộng chuẩn hóa (0-1)', label_en: 'YOLO Normalized Width (0-1)', label_zh: 'YOLO 归一化宽度 (0-1)' },
    { key: 'HEIGHT_NORM', group: 'yolo', label_vi: 'Chiều cao chuẩn hóa (0-1)', label_en: 'YOLO Normalized Height (0-1)', label_zh: 'YOLO 归一化高度 (0-1)' },

    // Image details
    { key: 'IMAGE_NAME', group: 'image', label_vi: 'Tên tệp ảnh gốc', label_en: 'Image File Name', label_zh: '原始图片文件名' },
    { key: 'IMAGE_WIDTH', group: 'image', label_vi: 'Chiều rộng ảnh gốc (px)', label_en: 'Original Image Width (px)', label_zh: '图片原始宽度 (px)' },
    { key: 'IMAGE_HEIGHT', group: 'image', label_vi: 'Chiều cao ảnh gốc (px)', label_en: 'Original Image Height (px)', label_zh: '图片原始高度 (px)' }
];

export const EXCEL_COLUMN_GROUPS = [
    { id: 'tags', icon: '🏷️', title_vi: 'Định Danh & Nhãn Tag', title_en: 'Identifiers & Tags', title_zh: '标识与标签' },
    { id: 'meta', icon: '📅', title_vi: 'Thời Gian & Ghi Chú', title_en: 'Dates & Notes', title_zh: '时间与备注' },
    { id: 'pixel', icon: '📐', title_vi: 'Tọa Độ Pixel (Gốc)', title_en: 'Pixel Coordinates', title_zh: '原始像素坐标' },
    { id: 'yolo', icon: '🤖', title_vi: 'Chuẩn Hóa YOLO AI (0 - 1)', title_en: 'YOLO AI Normalized (0-1)', title_zh: 'YOLO AI 归一化 (0-1)' },
    { id: 'image', icon: '🖼️', title_vi: 'Thông Tin Ảnh Gốc', title_en: 'Image Information', title_zh: '原始图片信息' }
];

export const EXCEL_COLUMN_PRESETS = {
    all: EXCEL_COLUMN_DEFINITIONS.map(c => c.key),
    minimal: ['STT', 'TAG_NAME', 'DATE_VN', 'X', 'Y', 'WIDTH', 'HEIGHT', 'NOTE'],
    pixel: ['STT', 'TAG_NAME', 'IMAGE_NAME', 'X', 'Y', 'WIDTH', 'HEIGHT', 'X_MAX', 'Y_MAX', 'NOTE'],
    yolo: ['CLASS_ID', 'TAG_NAME', 'IMAGE_NAME', 'X_CENTER_NORM', 'Y_CENTER_NORM', 'WIDTH_NORM', 'HEIGHT_NORM', 'DATE_ISO'],
    db: ['ID', 'IMAGE_NAME', 'TAG_ID', 'TAG_NAME', 'CLASS_ID', 'DATE_ISO', 'X', 'Y', 'WIDTH', 'HEIGHT', 'NOTE', 'CREATED_AT'],
    none: []
};

export const STORAGE_EXCEL_COLUMNS_KEY = 'bbox_studio_excel_columns';

/**
 * Lấy danh sách cột được chọn từ localStorage hoặc mặc định tất cả 23 cột
 * @returns {Array<string>}
 */
export function getSelectedExcelColumns() {
    try {
        const saved = localStorage.getItem(STORAGE_EXCEL_COLUMNS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Chỉ giữ các cột hợp lệ tồn tại trong định nghĩa
                const validKeys = new Set(EXCEL_COLUMN_DEFINITIONS.map(c => c.key));
                const filtered = parsed.filter(k => validKeys.has(k));
                if (filtered.length > 0) return filtered;
            }
        }
    } catch (e) {
        // Fallback mặc định
    }
    return [...EXCEL_COLUMN_PRESETS.all];
}

/**
 * Lưu danh sách cột vào localStorage và cập nhật giao diện
 * @param {Array<string>} cols
 */
export function setSelectedExcelColumns(cols) {
    try {
        localStorage.setItem(STORAGE_EXCEL_COLUMNS_KEY, JSON.stringify(cols));
    } catch (e) {}
    renderExcelColumnCheckboxes();
    updateExcelColumnCounter();
}

/**
 * Cập nhật số lượng cột đã chọn ở thanh toolbar modal
 */
export function updateExcelColumnCounter() {
    const counterEl = document.getElementById('excelSelectedCounter');
    if (!counterEl) return;
    const selected = getSelectedExcelColumns();
    const total = EXCEL_COLUMN_DEFINITIONS.length;
    counterEl.innerHTML = t('excel_selected_count', { selected: selected.length, total: total });
}

/**
 * Render danh sách nhóm và các checkbox cột dữ liệu
 */
export function renderExcelColumnCheckboxes() {
    const container = document.getElementById('excelColumnGroupsContainer');
    if (!container) return;

    const selectedCols = new Set(getSelectedExcelColumns());
    const currentLang = getCurrentLanguage() || 'vi';

    container.innerHTML = EXCEL_COLUMN_GROUPS.map(group => {
        const groupCols = EXCEL_COLUMN_DEFINITIONS.filter(c => c.group === group.id);
        const groupTitle = group[`title_${currentLang}`] || group.title_vi;
        const selectedCountInGroup = groupCols.filter(c => selectedCols.has(c.key)).length;
        const isAllInGroupSelected = selectedCountInGroup === groupCols.length;

        const colsHtml = groupCols.map(col => {
            const isChecked = selectedCols.has(col.key);
            const label = col[`label_${currentLang}`] || col.label_vi || col.key;
            return `
                <label class="flex items-start gap-2.5 p-2 rounded-xl border ${isChecked ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30' : 'border-stone-200/70 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-800/40'} hover:border-emerald-400 dark:hover:border-emerald-600 transition cursor-pointer select-none">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleExcelColumn('${col.key}')"
                           class="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600">
                    <div class="flex-1 min-w-0">
                        <div class="font-mono text-xs font-bold text-stone-800 dark:text-stone-200 truncate flex items-center gap-1">
                            <span>${col.key}</span>
                        </div>
                        <div class="text-[11px] text-stone-500 dark:text-stone-400 leading-snug line-clamp-2">
                            ${label}
                        </div>
                    </div>
                </label>
            `;
        }).join('');

        return `
            <div class="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 p-4 shadow-sm">
                <div class="flex items-center justify-between pb-2.5 mb-3 border-b border-stone-100 dark:border-stone-800">
                    <div class="flex items-center gap-2">
                        <span class="text-base">${group.icon}</span>
                        <h4 class="font-bold text-xs text-stone-800 dark:text-stone-100 uppercase tracking-wider">${groupTitle}</h4>
                        <span class="text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                            ${selectedCountInGroup}/${groupCols.length}
                        </span>
                    </div>
                    <button onclick="toggleExcelGroup('${group.id}')"
                            class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                        ${isAllInGroupSelected ? 'Bỏ chọn nhóm' : 'Chọn cả nhóm'}
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    ${colsHtml}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Đảo trạng thái chọn của một cột duy nhất
 * @param {string} colKey
 */
export function toggleExcelColumn(colKey) {
    const current = new Set(getSelectedExcelColumns());
    if (current.has(colKey)) {
        current.delete(colKey);
    } else {
        current.add(colKey);
    }
    setSelectedExcelColumns(Array.from(current));
}

/**
 * Chọn hoặc bỏ chọn toàn bộ một nhóm cột
 * @param {string} groupId
 */
export function toggleExcelGroup(groupId) {
    const groupCols = EXCEL_COLUMN_DEFINITIONS.filter(c => c.group === groupId).map(c => c.key);
    const current = new Set(getSelectedExcelColumns());
    const isAllSelected = groupCols.every(k => current.has(k));

    if (isAllSelected) {
        groupCols.forEach(k => current.delete(k));
    } else {
        groupCols.forEach(k => current.add(k));
    }
    setSelectedExcelColumns(Array.from(current));
}

/**
 * Áp dụng Preset cột xuất nhanh
 * @param {'all'|'minimal'|'pixel'|'yolo'|'db'|'none'} presetName
 */
export function applyExcelColumnPreset(presetName) {
    const preset = EXCEL_COLUMN_PRESETS[presetName] || EXCEL_COLUMN_PRESETS.all;
    setSelectedExcelColumns([...preset]);
}

/**
 * Mở modal chọn cột xuất Excel & Database
 */
export function openExcelColumnModal() {
    if (state.boundingBoxes.length === 0) {
        showToast(t('toast_no_boxes_excel'), 'rose');
        return;
    }

    const modal = document.getElementById('excelColumnsModal');
    if (!modal) return;

    renderExcelColumnCheckboxes();
    updateExcelColumnCounter();

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

/**
 * Đóng modal chọn cột xuất Excel
 */
export function closeExcelColumnModal() {
    const modal = document.getElementById('excelColumnsModal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

/**
 * Thực thi xuất file từ nút trong modal
 * @param {'xlsx'|'csv'} format
 */
export function executeExcelExport(format = 'xlsx') {
    const selected = getSelectedExcelColumns();
    if (selected.length === 0) {
        showToast(t('toast_no_columns_selected'), 'rose');
        return;
    }

    closeExcelColumnModal();

    if (format === 'csv') {
        exportToCsv(null, null, selected);
    } else {
        exportToExcel(selected, true);
    }
}

/**
 * Xuất dữ liệu ra file Excel (.xlsx) theo định dạng các cột được chọn
 * @param {Array<string>} [selectedColumns]
 * @param {boolean} [forceDirect=false]
 */
export function exportToExcel(selectedColumns = null, forceDirect = false) {
    if (state.boundingBoxes.length === 0) {
        showToast(t('toast_no_boxes_excel'), 'rose');
        return;
    }

    // Nếu người dùng bấm trực tiếp từ giao diện (không truyền danh sách cột và không ép xuất trực tiếp),
    // mở hộp thoại để người dùng chọn cột xuất
    if (!forceDirect && !Array.isArray(selectedColumns)) {
        openExcelColumnModal();
        return;
    }

    const cols = Array.isArray(selectedColumns) && selectedColumns.length > 0 
        ? selectedColumns 
        : getSelectedExcelColumns();

    if (cols.length === 0) {
        showToast(t('toast_no_columns_selected'), 'rose');
        return;
    }

    const rows = generateDatabaseRows(cols);
    const baseName = state.currentImageName.replace(/\.[^/.]+$/, '') || 'annotations';

    if (window.XLSX && window.XLSX.utils) {
        const worksheet = window.XLSX.utils.json_to_sheet(rows);
        
        // Tự động điều chỉnh độ rộng cột tối thiểu cho đẹp mắt
        const colWidths = Object.keys(rows[0] || {}).map(key => ({
            wch: Math.max(key.length + 3, 12)
        }));
        worksheet['!cols'] = colWidths;

        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "Annotations_DB");
        window.XLSX.writeFile(workbook, `${baseName}_database.xlsx`);
        showToast(t('toast_excel_exported_cols', { cols: cols.length, count: rows.length }), 'emerald');
    } else {
        // Fallback tự động xuất CSV với UTF-8 BOM chuẩn cho Database & Excel
        exportToCsv(rows, baseName, cols);
    }
}

/**
 * Xuất dữ liệu ra file CSV với UTF-8 BOM (chuẩn mở trên Excel & lệnh SQL LOAD DATA / COPY)
 * @param {Array<object>} [customRows]
 * @param {string} [customBaseName]
 * @param {Array<string>} [selectedColumns]
 */
export function exportToCsv(customRows = null, customBaseName = null, selectedColumns = null) {
    const cols = Array.isArray(selectedColumns) && selectedColumns.length > 0 
        ? selectedColumns 
        : getSelectedExcelColumns();

    const rows = customRows || generateDatabaseRows(cols);
    if (!rows || rows.length === 0) {
        showToast(t('toast_no_boxes_excel'), 'rose');
        return;
    }

    const headers = Object.keys(rows[0] || {});
    if (headers.length === 0) {
        showToast(t('toast_no_columns_selected'), 'rose');
        return;
    }

    const csvLines = [];

    // Dòng tiêu đề
    csvLines.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

    // Các dòng dữ liệu
    rows.forEach(row => {
        const line = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
            return `"${val.replace(/"/g, '""')}"`;
        }).join(',');
        csvLines.push(line);
    });

    // Thêm UTF-8 BOM (\uFEFF) để Excel mở tiếng Việt không bị lỗi font
    const csvContent = '\uFEFF' + csvLines.join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const baseName = customBaseName || state.currentImageName.replace(/\.[^/.]+$/, '') || 'annotations';
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_database.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(t('toast_csv_exported_cols', { cols: headers.length, count: rows.length }), 'emerald');
}

/**
 * Tải xuống file ảnh PNG đã được vẽ khung, Tag và Ngày trực tiếp lên ảnh
 */
export function downloadAnnotatedImage() {
    if (!state.currentImage) return;
    const canvas = getCanvas();
    if (!canvas) return;

    // Vẽ đầy đủ nhãn Tag + Ngày lên Canvas trước khi xuất file ảnh
    redrawCanvas(true);
    const dataUrl = canvas.toDataURL('image/png');
    // Khôi phục lại chế độ hiển thị chuẩn
    redrawCanvas(false);

    const baseName = state.currentImageName.replace(/\.[^/.]+$/, '') || 'image';
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${baseName}_boxed.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast(t('toast_img_downloaded'), 'emerald');
}

/**
 * Đóng / Mở modal phóng to JSON
 */
export function toggleJsonModal() {
    const modal = document.getElementById('jsonModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        updateJsonPreview();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Kích hoạt mở file dialog để chọn tệp JSON
 */
export function triggerImportJson() {
    const fileInput = document.getElementById('jsonFileInput');
    if (fileInput) {
        fileInput.value = '';
        fileInput.click();
    }
}

/**
 * Xử lý khi người dùng chọn file JSON từ máy tính
 * @param {Event} e
 */
export function handleJsonFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
        showToast('Vui lòng chọn file định dạng .json!', 'rose');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const result = importJsonData(event.target.result);
            if (result.success) {
                showToast(t('toast_json_imported', { count: result.count, name: file.name }), 'emerald');
            }
        } catch (err) {
            showToast(err.message || 'Lỗi khi đọc file JSON!', 'rose');
        }
    };
    reader.readAsText(file);
}

/**
 * Phân tích và nạp dữ liệu từ chuỗi JSON hoặc đối tượng JSON vào state của ứng dụng
 * @param {string|object} jsonInput
 * @param {'replace'|'append'} [mode='replace']
 * @returns {{success: boolean, count: number}}
 */
export function importJsonData(jsonInput, mode = 'replace') {
    let data;
    try {
        data = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
    } catch (err) {
        throw new Error('Dữ liệu JSON không hợp lệ! Vui lòng kiểm tra cú pháp.');
    }

    // 1. Phục hồi và bổ sung toàn bộ danh mục Tag nếu file JSON có chứa categories / tags / tagChoices
    const rawCategories = data.categories || data.tags || data.tagChoices;
    let importedTagsCount = 0;
    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
        rawCategories.forEach((cat, idx) => {
            if (!cat) return;
            const tagName = cat.name || cat.tag_name || cat.label;
            if (!tagName) return;
            const tagId = cat.id || cat.tag_id || String(tagName).toLowerCase().replace(/\s+/g, '_');
            const existing = state.tagChoices.find(t => t.id === tagId || t.name === tagName);
            if (existing) {
                existing.name = tagName;
                if (cat.color) existing.color = cat.color;
                if (cat.icon) existing.icon = cat.icon;
                if (cat.class_id !== undefined || cat.classId !== undefined) {
                    existing.classId = Number(cat.class_id ?? cat.classId);
                }
            } else {
                state.tagChoices.push({
                    id: tagId,
                    classId: cat.class_id !== undefined ? Number(cat.class_id) : (cat.classId !== undefined ? Number(cat.classId) : state.tagChoices.length),
                    name: tagName,
                    color: cat.color || '#ff2a6d',
                    icon: cat.icon || '🏷️'
                });
                importedTagsCount++;
            }
        });
        saveTagsToStorage();
    }

    let items = [];
    if (Array.isArray(data)) {
        items = data;
    } else if (data && Array.isArray(data.annotations)) {
        items = data.annotations;
    } else if (data && Array.isArray(data.boxes)) {
        items = data.boxes;
    } else if (data && Array.isArray(data.boundingBoxes)) {
        items = data.boundingBoxes;
    } else if (data && Array.isArray(data.data)) {
        items = data.data;
    }

    // Nếu JSON chỉ chứa danh mục Tag thuần túy mà không có khung vẽ nào
    if (items.length === 0) {
        if (importedTagsCount > 0) {
            renderTagChoicesUI();
            syncAllViews();
            return { success: true, count: 0, tagsCount: importedTagsCount };
        }
        throw new Error('Không tìm thấy danh sách khung (annotations) hoặc danh mục Tag trong file JSON!');
    }

    const imgW = state.currentImage ? state.currentImage.naturalWidth : (data.image_width || 980);
    const imgH = state.currentImage ? state.currentImage.naturalHeight : (data.image_height || 600);

    const parsedBoxes = [];
    items.forEach((item, idx) => {
        // Tọa độ
        let x = 0, y = 0, width = 50, height = 50;
        if (item.coordinates) {
            x = item.coordinates.x ?? 0;
            y = item.coordinates.y ?? 0;
            width = item.coordinates.width ?? ((item.coordinates.xmax ?? x) - x);
            height = item.coordinates.height ?? ((item.coordinates.ymax ?? y) - y);
        } else if (item.x !== undefined && item.y !== undefined) {
            x = Number(item.x) || 0;
            y = Number(item.y) || 0;
            width = Number(item.width ?? item.w ?? 50);
            height = Number(item.height ?? item.h ?? 50);
        } else if (item.xmin !== undefined && item.ymin !== undefined) {
            x = Number(item.xmin) || 0;
            y = Number(item.ymin) || 0;
            width = Math.max(1, (Number(item.xmax) || (x + 50)) - x);
            height = Math.max(1, (Number(item.ymax) || (y + 50)) - y);
        } else if (item.yolo_normalized) {
            const yn = item.yolo_normalized;
            width = Math.round(yn.width * imgW);
            height = Math.round(yn.height * imgH);
            x = Math.round((yn.x_center * imgW) - (width / 2));
            y = Math.round((yn.y_center * imgH) - (height / 2));
        }

        // Tag info
        const tagName = item.tag_name || item.tag || item.label || item.name || 'other';
        const tagIdCandidate = item.tag_id || item.tagId || String(tagName).toLowerCase().replace(/\s+/g, '_');
        
        let tag = state.tagChoices.find(t => t.id === tagIdCandidate || t.name === tagName);
        if (!tag) {
            // Tự động tạo Tag mới nếu chưa có trong danh mục
            const colors = ['#ff2a6d', '#ff7b00', '#9333ea', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#3b82f6'];
            const newColor = colors[state.tagChoices.length % colors.length];
            tag = {
                id: tagIdCandidate,
                classId: state.tagChoices.length,
                name: tagName,
                color: item.color || newColor,
                icon: item.icon || '🏷️'
            };
            state.tagChoices.push(tag);
        }

        // Ngày tháng
        let boxDate = item.date_iso || item.date || item.ngay;
        if (boxDate && boxDate.includes('/')) {
            // Chuyển đổi DD/MM/YYYY sang YYYY-MM-DD
            const parts = boxDate.split('/');
            if (parts.length === 3) boxDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        if (!boxDate) boxDate = state.defaultBoxDate;

        parsedBoxes.push({
            id: Date.now() + idx + Math.floor(Math.random() * 1000),
            tagId: tag.id,
            label: tag.name,
            date: boxDate,
            note: String(item.note || item.ghi_chu || ''),
            x: Math.max(0, Math.round(x)),
            y: Math.max(0, Math.round(y)),
            width: Math.max(8, Math.round(width)),
            height: Math.max(8, Math.round(height)),
            color: tag.color
        });
    });

    if (mode === 'replace') {
        state.boundingBoxes = parsedBoxes;
    } else {
        state.boundingBoxes = [...state.boundingBoxes, ...parsedBoxes];
    }

    state.boxCounter = state.boundingBoxes.length + 1;
    state.selectedBoxId = state.boundingBoxes.length > 0 ? state.boundingBoxes[0].id : null;
    if (state.selectedBoxId) {
        state.activeTagId = state.boundingBoxes[0].tagId;
    }

    // Nếu JSON có tên file ảnh và chưa tải ảnh thì gán tên hiển thị
    if (data.image_name && !state.currentImage) {
        state.currentImageName = data.image_name;
        const nameDisplay = document.getElementById('imgNameDisplay');
        if (nameDisplay) nameDisplay.textContent = state.currentImageName;
    }

    saveTagsToStorage();
    renderTagChoicesUI();
    syncAllViews();

    return { success: true, count: parsedBoxes.length };
}
