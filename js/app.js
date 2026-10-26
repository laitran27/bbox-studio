// ==========================================
// KHỞI ĐỘNG ỨNG DỤNG & ĐIỀU PHỐI (ENTRY POINT)
// ==========================================

import { state } from './state.js';
import { toggleFileDropdown, toggleExportDropdown, closeAllDropdowns, initDropdownListeners } from './utils.js';
import { setCreativeTheme, setColorMode, getColorMode, initColorMode } from './theme.js';
import { initCanvasElements, redrawCanvas, loadDemoImage, toggleFitMode, loadImageFromUrl } from './canvas.js';
import { initOverlayLayer, renderOverlayBoxes, handleInlineDatePresetChange } from './overlay.js';
import { notifyParent, parseUrlParameters, setupIframeMessageListener, isEmbeddedInIframe } from './iframe.js';
import {
    handleDefaultDatePresetChange,
    handleDefaultDateManualChange,
    setupEventListeners,
    startBoxMove,
    startBoxResize
} from './interaction.js';
import {
    renderBoxList,
    clearDateFilter,
    handleFilterChange,
    updateBoxTag,
    updateBoxDate,
    updateBoxNote,
    updateBoxCoord,
    deleteBox,
    undoLastBox,
    clearAllBoxes
} from './sidebar.js';
import {
    renderTagChoicesUI,
    setActiveTag,
    toggleAddTagModal,
    createNewCustomTag,
    editExistingTag,
    updateDefaultTagNames,
    selectNewTagIcon,
    deleteTag,
    renderBasicIconPalette,
    downloadTagTemplateExcel,
    exportCurrentTagsToExcel,
    triggerImportTagExcel,
    handleTagExcelFileImport,
    saveTagsToStorage,
    loadTagsFromStorage,
    parseAndApplyTagRows
} from './tags.js';
import {
    initLanguage,
    getCurrentLanguage,
    setLanguage,
    updateLangSwitcherUI,
    applyTranslationsToDOM
} from './i18n.js';
import {
    copySingleBoxCoord,
    copyAllCoordsToClipboard,
    downloadJsonFile,
    downloadAnnotatedImage,
    toggleJsonModal,
    exportToExcel,
    exportToCsv,
    generateDatabaseRows,
    triggerImportJson,
    handleJsonFileImport,
    importJsonData,
    getFormattedExportData,
    openExcelColumnModal,
    closeExcelColumnModal,
    applyExcelColumnPreset,
    toggleExcelColumn,
    toggleExcelGroup,
    executeExcelExport,
    getSelectedExcelColumns,
    setSelectedExcelColumns
} from './export.js';

/**
 * Đồng bộ toàn bộ các view: Canvas, Lớp DOM Overlay trên ảnh và Danh sách bên phải
 */
export function syncAllViews() {
    redrawCanvas();
    renderOverlayBoxes();
    renderBoxList();
    notifyParent('BOXES_UPDATED', { count: state.boundingBoxes.length });
}

// ==========================================
// ĐĂNG KÝ CÁC HÀM TƯƠNG TÁC VÀO WINDOW CHO INLINE HTML
// ==========================================
window.toggleFileDropdown = toggleFileDropdown;
window.toggleExportDropdown = toggleExportDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.setColorMode = setColorMode;
window.getColorMode = getColorMode;
window.setCreativeTheme = setCreativeTheme;
window.loadDemoImage = loadDemoImage;
window.downloadAnnotatedImage = downloadAnnotatedImage;
window.handleDefaultDatePresetChange = handleDefaultDatePresetChange;
window.handleDefaultDateManualChange = handleDefaultDateManualChange;
window.renderOverlayBoxes = renderOverlayBoxes;
window.toggleFitMode = toggleFitMode;
window.setActiveTag = setActiveTag;
window.toggleAddTagModal = toggleAddTagModal;
window.undoLastBox = undoLastBox;
window.clearAllBoxes = clearAllBoxes;
window.renderBoxList = renderBoxList;
window.handleFilterChange = handleFilterChange;
window.clearDateFilter = clearDateFilter;
window.toggleJsonModal = toggleJsonModal;
window.copyAllCoordsToClipboard = copyAllCoordsToClipboard;
window.downloadJsonFile = downloadJsonFile;
window.createNewCustomTag = createNewCustomTag;
window.editExistingTag = editExistingTag;
window.deleteTag = deleteTag;
window.selectNewTagIcon = selectNewTagIcon;
window.renderBasicIconPalette = renderBasicIconPalette;
window.updateBoxTag = updateBoxTag;
window.updateBoxDate = updateBoxDate;
window.updateBoxNote = updateBoxNote;
window.updateBoxCoord = updateBoxCoord;
window.deleteBox = deleteBox;
window.handleInlineDatePresetChange = handleInlineDatePresetChange;
window.copySingleBoxCoord = copySingleBoxCoord;
window.loadImageFromUrl = loadImageFromUrl;
window.notifyParent = notifyParent;
window.isEmbeddedInIframe = isEmbeddedInIframe;
window.startBoxMove = startBoxMove;
window.startBoxResize = startBoxResize;
window.exportToExcel = exportToExcel;
window.exportToCsv = exportToCsv;
window.generateDatabaseRows = generateDatabaseRows;
window.triggerImportJson = triggerImportJson;
window.handleJsonFileImport = handleJsonFileImport;
window.importJsonData = importJsonData;
window.getFormattedExportData = getFormattedExportData;
window.openExcelColumnModal = openExcelColumnModal;
window.closeExcelColumnModal = closeExcelColumnModal;
window.applyExcelColumnPreset = applyExcelColumnPreset;
window.toggleExcelColumn = toggleExcelColumn;
window.toggleExcelGroup = toggleExcelGroup;
window.executeExcelExport = executeExcelExport;
window.getSelectedExcelColumns = getSelectedExcelColumns;
window.setSelectedExcelColumns = setSelectedExcelColumns;
window.downloadTagTemplateExcel = downloadTagTemplateExcel;
window.exportCurrentTagsToExcel = exportCurrentTagsToExcel;
window.triggerImportTagExcel = triggerImportTagExcel;
window.handleTagExcelFileImport = handleTagExcelFileImport;
window.saveTagsToStorage = saveTagsToStorage;
window.loadTagsFromStorage = loadTagsFromStorage;
window.parseAndApplyTagRows = parseAndApplyTagRows;

/**
 * Đổi ngôn ngữ và cập nhật view
 * @param {'vi'|'en'|'zh'} lang
 */
export function changeAppLanguage(lang) {
    setLanguage(lang, () => {
        updateDefaultTagNames();
        renderTagChoicesUI();
        syncAllViews();
    });
}
window.setAppLanguage = changeAppLanguage;
window.getCurrentLanguage = getCurrentLanguage;

/**
 * Hàm khởi tạo chính của ứng dụng
 */
function initApp() {
    initColorMode();
    initDropdownListeners();
    initCanvasElements();
    initOverlayLayer();
    initLanguage();
    loadTagsFromStorage();
    updateDefaultTagNames();
    applyTranslationsToDOM();
    updateLangSwitcherUI();

    const defaultDateInput = document.getElementById('defaultDateInput');
    if (defaultDateInput) {
        defaultDateInput.value = state.defaultBoxDate;
    }

    const jsonFileInput = document.getElementById('jsonFileInput');
    if (jsonFileInput) {
        jsonFileInput.addEventListener('change', handleJsonFileImport);
    }

    const tagExcelFileInput = document.getElementById('tagExcelFileInput');
    if (tagExcelFileInput) {
        tagExcelFileInput.addEventListener('change', handleTagExcelFileImport);
    }

    renderTagChoicesUI();
    setupEventListeners();
    loadDemoImage(true);

    // Xử lý nạp qua iframe (URL parameters & postMessage API)
    parseUrlParameters();
    setupIframeMessageListener();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
