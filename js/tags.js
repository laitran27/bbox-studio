// ==========================================
// QUẢN LÝ DANH MỤC TAG & COMBO CHOICES
// ==========================================

import { state, getTagById } from './state.js';
import { escapeHtml, showToast } from './utils.js';
import { t } from './i18n.js';
import { syncAllViews } from './app.js';

/**
 * Cập nhật tên của các Tag mặc định theo ngôn ngữ đang chọn
 */
export function updateDefaultTagNames() {
    const defaultTagKeys = {
        person: 'tag_person',
        face: 'tag_face',
        vehicle: 'tag_vehicle',
        device: 'tag_device',
        object: 'tag_object',
        animal: 'tag_animal',
        text: 'tag_text',
        defect: 'tag_defect',
        other: 'tag_other'
    };

    state.tagChoices.forEach(tag => {
        if (defaultTagKeys[tag.id]) {
            tag.name = t(defaultTagKeys[tag.id]);
        }
    });

    state.boundingBoxes.forEach(b => {
        if (defaultTagKeys[b.tagId]) {
            b.label = t(defaultTagKeys[b.tagId]);
        }
    });
}

/**
 * Cập nhật toàn bộ các Combo chọn Tag trên thanh công cụ, Sidebar và danh sách quản lý
 */
export function renderTagChoicesUI() {
    const chipsContainer = document.getElementById('tagChipsContainer');
    const activeSelect = document.getElementById('activeTagSelect');
    const toolbarCombo = document.getElementById('toolbarActiveTagCombo');
    const filterSelect = document.getElementById('filterTagSelect');
    const currentFilter = filterSelect ? filterSelect.value : 'ALL';

    if (!chipsContainer || !activeSelect || !toolbarCombo || !filterSelect) return;

    // 1. Render nút Chip chọn nhanh
    chipsContainer.innerHTML = '';
    state.tagChoices.forEach((tag, idx) => {
        const isSelected = tag.id === state.activeTagId;
        const shortcutKey = idx < 9 ? idx + 1 : '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => setActiveTag(tag.id);
        btn.className = `px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer border-2 ${
            isSelected 
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-md scale-[1.02]' 
                : 'bg-orange-50/60 dark:bg-stone-800/60 text-stone-600 dark:text-stone-300 border-orange-100 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-stone-100'
        }`;
        if (isSelected) {
            btn.style.borderColor = tag.color;
            btn.style.boxShadow = `0 4px 12px ${tag.color}30`;
        }
        btn.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${tag.color}"></span>
            <span>${tag.icon} ${escapeHtml(tag.id)}-${escapeHtml(tag.name)}</span>
            ${shortcutKey ? `<kbd class="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-orange-100/80 dark:bg-stone-700 text-rose-600 dark:text-rose-400 rounded-md font-extrabold">${shortcutKey}</kbd>` : ''}
        `;
        chipsContainer.appendChild(btn);
    });

    // 2. Render vào cả 2 Combo Tag (Thanh công cụ ảnh & Sidebar)
    const comboHtml = state.tagChoices.map((tag, idx) => 
        `<option value="${tag.id}" ${tag.id === state.activeTagId ? 'selected' : ''}>${idx + 1}. ${tag.icon} ${escapeHtml(tag.id)}-${escapeHtml(tag.name)}</option>`
    ).join('');
    activeSelect.innerHTML = comboHtml;
    toolbarCombo.innerHTML = comboHtml;

    // 3. Render vào Dropdown lọc theo Tag
    filterSelect.innerHTML = `<option value="ALL">${t('filter_tag_all')} (${state.boundingBoxes.length})</option>`;
    state.tagChoices.forEach(tag => {
        const count = state.boundingBoxes.filter(b => b.tagId === tag.id).length;
        const opt = document.createElement('option');
        opt.value = tag.id;
        opt.textContent = `${tag.icon} ${tag.id}-${tag.name} (${count})`;
        if (tag.id === currentFilter) opt.selected = true;
        filterSelect.appendChild(opt);
    });

    renderExistingTagsManager();
}

/**
 * Đặt Tag đang được chọn, đồng thời cập nhật luôn Tag của khung đang được chọn (nếu có)
 * và đồng bộ ngay lập tức sang danh sách hiển thị bên phải
 * @param {string} tagId
 */
export function setActiveTag(tagId) {
    const tag = getTagById(tagId);
    if (!tag) return;
    state.activeTagId = tag.id;

    // Nếu đang có một khung được chọn, cập nhật Tag cho chính khung đó luôn!
    if (state.selectedBoxId !== null) {
        const selectedBox = state.boundingBoxes.find(b => String(b.id) === String(state.selectedBoxId));
        if (selectedBox) {
            selectedBox.tagId = tag.id;
            selectedBox.label = tag.name;
            selectedBox.color = tag.color;
            const boxIndex = state.boundingBoxes.indexOf(selectedBox) + 1;
            showToast(`Đã đổi Tag khung #${boxIndex} thành "${tag.icon} ${tag.name}"`, 'emerald');
        }
    } else {
        showToast(`Tag mặc định cho khung tiếp theo: ${tag.icon} ${tag.name}`, 'rose');
    }

    renderTagChoicesUI();
    syncAllViews();
}

/**
 * Danh sách các icon cơ bản phổ biến cho đóng khung & phân loại nhãn
 */
export const basicIcons = [
    '🏷️', '👤', '👥', '😊', '🚗', '🏍️', '🚲', '🚚',
    '💻', '📱', '📷', '🍹', '☕', '🍔', '🍎', '📦',
    '🎁', '🛒', '🛍️', '🐾', '🐶', '🐱', '🌿', '⚠️',
    '❌', '✅', '⭐', '🔥', '⚡', '🔍', '🚩', '📌',
    '🎯', '🔤', '🔢'
];

/**
 * Hiển thị bảng chọn icon cơ bản nhanh trong modal
 */
export function renderBasicIconPalette() {
    const palette = document.getElementById('basicIconPicker');
    if (!palette) return;
    const currentIcon = document.getElementById('newTagIconInput')?.value || '🏷️';
    palette.innerHTML = '';
    basicIcons.forEach(icon => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isSelected = icon === currentIcon;
        btn.className = `w-7 h-7 rounded-lg flex items-center justify-center text-sm transition cursor-pointer border ${
            isSelected 
                ? 'bg-rose-100 dark:bg-rose-950 border-rose-500 scale-110 shadow-sm ring-2 ring-rose-400/40 text-stone-900 dark:text-white' 
                : 'bg-white dark:bg-stone-800 hover:bg-orange-50 dark:hover:bg-stone-700 border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-stone-500 text-stone-800 dark:text-stone-200'
        }`;
        btn.textContent = icon;
        btn.onclick = () => selectNewTagIcon(icon);
        palette.appendChild(btn);
    });
}

/**
 * Chọn một icon từ bảng mẫu và gán vào input
 * @param {string} icon
 */
export function selectNewTagIcon(icon) {
    const input = document.getElementById('newTagIconInput');
    if (input) input.value = icon;
    renderBasicIconPalette();
}

/**
 * Đóng / Mở modal quản lý danh mục Tag
 */
export function toggleAddTagModal() {
    const modal = document.getElementById('addTagModal');
    if (!modal) return;
    if (modal.classList.contains('hidden')) {
        const nameInput = document.getElementById('newTagNameInput');
        if (nameInput) nameInput.value = '';
        const idInput = document.getElementById('newTagIdInput');
        if (idInput) idInput.value = '';
        renderBasicIconPalette();
        renderExistingTagsManager();
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

/**
 * Hiển thị danh sách các Tag hiện có trong modal để người dùng chỉnh sửa & xóa
 */
export function renderExistingTagsManager() {
    const listEl = document.getElementById('existingTagsManagerList');
    if (!listEl) return;
    listEl.innerHTML = '';
    state.tagChoices.forEach((tag) => {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-2';
        row.innerHTML = `
            <input type="text" value="${escapeHtml(tag.icon)}" maxlength="3"
                   onchange="editExistingTag('${tag.id}', 'icon', this.value)"
                   title="${t('tag_modal_icon')}"
                   class="w-9 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 rounded-lg py-1 text-center text-xs outline-none font-bold">
            <input type="text" value="${escapeHtml(tag.id)}"
                   onchange="editExistingTag('${tag.id}', 'id', this.value)"
                   title="${t('tag_modal_id')}"
                   placeholder="ID"
                   class="w-24 sm:w-28 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:border-rose-400 rounded-lg px-2 py-1 text-xs font-mono font-bold text-stone-800 dark:text-stone-100 outline-none">
            <input type="text" value="${escapeHtml(tag.name)}"
                   onchange="editExistingTag('${tag.id}', 'name', this.value)"
                   placeholder="${t('tag_modal_name')}"
                   class="flex-1 min-w-[100px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 focus:border-rose-400 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-800 dark:text-stone-100 outline-none">
            <input type="color" value="${tag.color}"
                   onchange="editExistingTag('${tag.id}', 'color', this.value)"
                   title="${t('tag_modal_color')}"
                   class="w-9 h-7 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 cursor-pointer p-0.5">
            <button type="button" onclick="deleteTag('${tag.id}')"
                    title="${t('tag_delete_btn_title')}"
                    class="w-8 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold transition cursor-pointer shrink-0 border border-rose-200 dark:border-rose-900/60">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        listEl.appendChild(row);
    });
}

/**
 * Xóa một Tag khỏi danh mục (và chuyển các khung đang dùng Tag này sang Tag khác)
 * @param {string} tagId
 */
export function deleteTag(tagId) {
    if (state.tagChoices.length <= 1) {
        showToast(t('toast_keep_at_least_one_tag'), 'rose');
        return;
    }

    const tagToDelete = state.tagChoices.find(t => t.id === tagId);
    if (!tagToDelete) return;

    const remainingTags = state.tagChoices.filter(t => t.id !== tagId);
    const fallbackTag = remainingTags[0];

    // Chuyển toàn bộ các khung đang dùng Tag này sang fallbackTag
    state.boundingBoxes.forEach(b => {
        if (b.tagId === tagId) {
            b.tagId = fallbackTag.id;
            b.label = fallbackTag.name;
            b.color = fallbackTag.color;
        }
    });

    // Nếu Tag đang chọn bị xóa, chuyển sang fallbackTag
    if (state.activeTagId === tagId) {
        state.activeTagId = fallbackTag.id;
    }

    state.tagChoices = remainingTags;

    saveTagsToStorage();
    renderTagChoicesUI();
    renderExistingTagsManager();
    syncAllViews();
    showToast(t('toast_tag_deleted'), 'rose');
}

/**
 * Sửa trực tiếp icon, mã ID, tên hoặc màu của một Tag đã có
 * @param {string} tagId
 * @param {'icon'|'id'|'name'|'color'} field
 * @param {string} value
 */
export function editExistingTag(tagId, field, value) {
    const tag = state.tagChoices.find(t => t.id === tagId);
    if (!tag) return;
    const cleanVal = (value || '').trim();

    if (field === 'id') {
        if (!cleanVal || cleanVal === tagId) {
            renderExistingTagsManager();
            return;
        }
        if (state.tagChoices.some(t => t.id === cleanVal && t !== tag)) {
            showToast(`Mã ID "${cleanVal}" đã tồn tại! Vui lòng chọn mã khác.`, 'rose');
            renderExistingTagsManager();
            return;
        }
        const oldId = tag.id;
        tag.id = cleanVal;

        // Cập nhật lại các khung đang liên kết với tagId cũ
        state.boundingBoxes.forEach(b => {
            if (b.tagId === oldId) {
                b.tagId = tag.id;
            }
        });

        if (state.activeTagId === oldId) {
            state.activeTagId = tag.id;
        }
    } else if (field === 'name') {
        if (!cleanVal) {
            renderExistingTagsManager();
            return;
        }
        tag.name = cleanVal;
    } else if (field === 'icon') {
        if (!cleanVal) {
            renderExistingTagsManager();
            return;
        }
        tag.icon = cleanVal;
    } else if (field === 'color') {
        tag.color = value;
    }

    // Cập nhật lại các khung đang dùng Tag này
    state.boundingBoxes.forEach(b => {
        if (b.tagId === tag.id) {
            b.label = tag.name;
            b.color = tag.color;
        }
    });

    saveTagsToStorage();
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_tag_updated'), 'emerald');
}

/**
 * Tạo một Tag mới và thêm vào danh mục choices
 */
export function createNewCustomTag() {
    const iconInput = document.getElementById('newTagIconInput');
    const idInput = document.getElementById('newTagIdInput');
    const nameInput = document.getElementById('newTagNameInput');
    const colorInput = document.getElementById('newTagColorInput');
    const name = nameInput ? nameInput.value.trim() : '';

    if (!name) {
        showToast(t('tag_modal_name_ph'), 'rose');
        return;
    }

    let customId = (idInput?.value || '').trim();
    if (!customId) {
        // Tự động tạo id từ tên hoặc timestamp nếu để trống
        customId = name.toLowerCase().replace(/[\s\W]+/g, '_').replace(/^_+|_+$/g, '') || ('tag_' + Date.now());
    }

    // Đảm bảo không trùng id
    let finalId = customId;
    let counter = 1;
    while (state.tagChoices.some(t => t.id === finalId)) {
        finalId = `${customId}_${counter++}`;
    }

    const newTag = {
        id: finalId,
        classId: state.tagChoices.length,
        name: name,
        color: (colorInput ? colorInput.value : null) || '#ff2a6d',
        icon: (iconInput ? iconInput.value.trim() : null) || '🏷️'
    };

    state.tagChoices.push(newTag);
    state.activeTagId = newTag.id;

    // Nếu đang chọn một khung, gán luôn Tag mới cho khung đó
    if (state.selectedBoxId !== null) {
        const selectedBox = state.boundingBoxes.find(b => String(b.id) === String(state.selectedBoxId));
        if (selectedBox) {
            selectedBox.tagId = newTag.id;
            selectedBox.label = newTag.name;
            selectedBox.color = newTag.color;
        }
    }

    if (nameInput) nameInput.value = '';
    if (idInput) idInput.value = '';

    saveTagsToStorage();
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_tag_added', { name: `${newTag.id}-${newTag.name}` }), 'emerald');
}

// ==========================================
// LƯU TRỮ VÀ NHẬP/XUẤT DANH MỤC TAG QUA EXCEL / CSV
// ==========================================

export const STORAGE_TAGS_KEY = 'bbox_studio_tags_catalog';

/**
 * Lưu danh mục tag hiện tại vào localStorage
 */
export function saveTagsToStorage() {
    try {
        localStorage.setItem(STORAGE_TAGS_KEY, JSON.stringify(state.tagChoices));
    } catch (e) {}
}

/**
 * Khôi phục danh mục tag từ localStorage nếu có
 * @returns {boolean}
 */
export function loadTagsFromStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_TAGS_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                state.tagChoices = parsed;
                if (!state.tagChoices.some(t => t.id === state.activeTagId)) {
                    state.activeTagId = state.tagChoices[0].id;
                }
                return true;
            }
        }
    } catch (e) {}
    return false;
}

/**
 * Tải file template Excel mẫu để người dùng điền danh sách Tag
 */
export function downloadTagTemplateExcel() {
    const templateRows = [
        {
            CLASS_ID: 0,
            TAG_NAME: "Sản phẩm lỗi (Defect)",
            TAG_ID: "defect",
            COLOR: "#e11d48",
            ICON: "⚠️",
            NOTE: "Dùng để đánh dấu các lỗi ngoại quan, trầy xước bề mặt"
        },
        {
            CLASS_ID: 1,
            TAG_NAME: "Biển số xe (License Plate)",
            TAG_ID: "license_plate",
            COLOR: "#9333ea",
            ICON: "🚗",
            NOTE: "Biển kiểm soát xe máy, ô tô, xe tải"
        },
        {
            CLASS_ID: 2,
            TAG_NAME: "Khuôn mặt (Face)",
            TAG_ID: "face",
            COLOR: "#ff7b00",
            ICON: "👤",
            NOTE: "Khuôn mặt nhân sự, khách hàng, đối tác"
        },
        {
            CLASS_ID: 3,
            TAG_NAME: "Mã vạch QR (Barcode)",
            TAG_ID: "barcode",
            COLOR: "#10b981",
            ICON: "🏷️",
            NOTE: "Vùng chứa mã vạch sản phẩm hoặc QR code"
        },
        {
            CLASS_ID: 4,
            TAG_NAME: "Thùng hàng / Bao bì (Package)",
            TAG_ID: "package",
            COLOR: "#f59e0b",
            ICON: "📦",
            NOTE: "Thùng carton, pallet hoặc kiện hàng đóng gói"
        }
    ];

    if (window.XLSX && window.XLSX.utils) {
        const worksheet = window.XLSX.utils.json_to_sheet(templateRows);
        worksheet['!cols'] = [
            { wch: 10 },
            { wch: 30 },
            { wch: 20 },
            { wch: 12 },
            { wch: 8 },
            { wch: 45 }
        ];
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "Tag_Template");
        window.XLSX.writeFile(workbook, "tag_template_bbox_studio.xlsx");
        showToast(t('toast_tag_template_downloaded'), 'emerald');
    } else {
        exportTagsToCsv(templateRows, "tag_template_bbox_studio");
        showToast(t('toast_tag_template_downloaded'), 'emerald');
    }
}

/**
 * Xuất danh sách toàn bộ Tag hiện có trong ứng dụng ra file Excel
 */
export function exportCurrentTagsToExcel() {
    if (!state.tagChoices || state.tagChoices.length === 0) return;

    const rows = state.tagChoices.map((t, idx) => ({
        CLASS_ID: t.classId !== undefined ? t.classId : idx,
        TAG_NAME: t.name,
        TAG_ID: t.id,
        COLOR: t.color,
        ICON: t.icon
    }));

    if (window.XLSX && window.XLSX.utils) {
        const worksheet = window.XLSX.utils.json_to_sheet(rows);
        worksheet['!cols'] = [
            { wch: 10 },
            { wch: 28 },
            { wch: 20 },
            { wch: 12 },
            { wch: 8 }
        ];
        const workbook = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(workbook, worksheet, "Tags");
        window.XLSX.writeFile(workbook, "danh_sach_tags.xlsx");
        showToast(t('toast_tags_exported_excel', { count: rows.length }), 'emerald');
    } else {
        exportTagsToCsv(rows, "danh_sach_tags");
        showToast(t('toast_tags_exported_excel', { count: rows.length }), 'emerald');
    }
}

/**
 * Xuất mảng tag ra file CSV với UTF-8 BOM
 * @param {Array<object>} rows
 * @param {string} [baseName]
 */
export function exportTagsToCsv(rows, baseName = 'tags') {
    if (!rows || rows.length === 0) return;
    const headers = Object.keys(rows[0] || {});
    const lines = [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')];
    rows.forEach(r => {
        lines.push(headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(','));
    });
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Kích hoạt mở file dialog chọn tệp Excel hoặc CSV chứa danh sách Tag
 */
export function triggerImportTagExcel() {
    const input = document.getElementById('tagExcelFileInput');
    if (input) {
        input.value = '';
        input.click();
    }
}

/**
 * Xử lý sự kiện khi người dùng chọn file Excel/CSV danh sách Tag
 * @param {Event} e
 */
export function handleTagExcelFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isXlsx = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCsv = fileName.endsWith('.csv');

    if (!isXlsx && !isCsv) {
        showToast('Vui lòng chọn file Excel (.xlsx, .xls) hoặc .csv!', 'rose');
        return;
    }

    const reader = new FileReader();
    if (isXlsx && window.XLSX) {
        reader.onload = function(event) {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = window.XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const rows = window.XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                parseAndApplyTagRows(rows, file.name);
            } catch (err) {
                showToast(err.message || 'Lỗi khi đọc file Excel!', 'rose');
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        reader.onload = function(event) {
            try {
                const text = event.target.result;
                const rows = parseCsvToObjects(text);
                parseAndApplyTagRows(rows, file.name);
            } catch (err) {
                showToast(err.message || 'Lỗi khi đọc file CSV!', 'rose');
            }
        };
        reader.readAsText(file, 'utf-8');
    }
}

/**
 * Phân tích các dòng từ bảng tính và nạp vào danh mục Tag
 * @param {Array<object>} rows
 * @param {string} sourceName
 */
export function parseAndApplyTagRows(rows, sourceName = 'file') {
    if (!Array.isArray(rows) || rows.length === 0) {
        showToast(t('toast_tags_empty_excel'), 'rose');
        return;
    }

    const colorPalette = [
        '#ff2a6d', '#ff7b00', '#9333ea', '#10b981', '#f59e0b',
        '#06b6d4', '#ec4899', '#3b82f6', '#14b8a6', '#8b5cf6'
    ];

    let count = 0;
    rows.forEach((row, idx) => {
        const rowKeys = Object.keys(row);
        const findVal = (...aliases) => {
            for (const alias of aliases) {
                const matchKey = rowKeys.find(k => k.trim().toLowerCase() === alias.toLowerCase());
                if (matchKey && row[matchKey] !== undefined && String(row[matchKey]).trim() !== '') {
                    return String(row[matchKey]).trim();
                }
            }
            return '';
        };

        const name = findVal('tag_name', 'tag name', 'tên tag', 'ten tag', 'name', 'label', 'nhãn');
        if (!name) return;

        let id = findVal('tag_id', 'tag id', 'mã tag', 'ma tag', 'id', 'code');
        if (!id) {
            id = 'tag_' + name.toLowerCase().replace(/[^\w\d]/g, '_').replace(/_+/g, '_');
        }

        const classIdVal = findVal('class_id', 'class id', 'classid', 'mã lớp', 'ma lop', 'stt');
        const color = findVal('color', 'màu', 'mau', 'hex') || colorPalette[(state.tagChoices.length + idx) % colorPalette.length];
        const icon = findVal('icon', 'emoji', 'biểu tượng', 'bieu tuong') || '🏷️';

        const existing = state.tagChoices.find(t => t.id === id || t.name === name);
        if (existing) {
            existing.name = name;
            existing.color = color;
            existing.icon = icon;
            if (classIdVal !== '') existing.classId = Number(classIdVal);
        } else {
            state.tagChoices.push({
                id: id,
                classId: classIdVal !== '' ? Number(classIdVal) : state.tagChoices.length,
                name: name,
                color: color,
                icon: icon
            });
            count++;
        }
    });

    if (count === 0 && rows.length > 0) {
        count = rows.length;
    }

    saveTagsToStorage();
    renderTagChoicesUI();
    syncAllViews();
    showToast(t('toast_tags_imported_excel', { count: count, name: sourceName }), 'emerald');
}

/**
 * Phân tích chuỗi CSV đơn giản thành mảng đối tượng
 * @param {string} csvText
 * @returns {Array<object>}
 */
export function parseCsvToObjects(csvText) {
    if (!csvText) return [];
    const cleanText = csvText.replace(/^\uFEFF/, '').trim();
    const lines = cleanText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const parseLine = (line) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(cur.trim());
                cur = '';
            } else {
                cur += char;
            }
        }
        result.push(cur.trim());
        return result;
    };

    const headers = parseLine(lines[0]);
    const objects = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        const obj = {};
        headers.forEach((h, idx) => {
            obj[h] = values[idx] ?? '';
        });
        objects.push(obj);
    }

    return objects;
}
