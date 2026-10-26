// ==========================================
// TÍCH HỢP IFRAME & GIAO TIẾP 2 CHIỀU (POSTMESSAGE API)
// ==========================================

import { state } from './state.js';
import { loadImageFromUrl } from './canvas.js';
import { importJsonData, getFormattedExportData, generateDatabaseRows } from './export.js';
import { setColorMode, setCreativeTheme } from './theme.js';
import { setLanguage } from './i18n.js';
import { updateDefaultTagNames, renderTagChoicesUI } from './tags.js';
import { clearAllBoxes } from './sidebar.js';
import { syncAllViews } from './app.js';

/**
 * Kiểm tra xem trang web hiện tại có đang được nhúng trong iframe không
 * @returns {boolean}
 */
export function isEmbeddedInIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/**
 * Gửi tin nhắn sự kiện từ BBox Studio ra trang cha (Parent Window)
 * @param {string} type - Loại sự kiện
 * @param {object} [payload] - Dữ liệu kèm theo
 */
export function notifyParent(type, payload = {}) {
    if (!isEmbeddedInIframe()) return;
    try {
        window.parent.postMessage({
            source: 'bbox-creative-studio',
            type,
            ...payload
        }, '*');
    } catch (e) {
        console.warn('Cannot postMessage to parent window', e);
    }
}

/**
 * Xử lý các tham số trên URL (Query Parameters) khi nạp trong iframe
 */
export function parseUrlParameters() {
    try {
        const params = new URLSearchParams(window.location.search);

        if (params.get('mode')) {
            setColorMode(params.get('mode'), false);
        }

        if (params.get('theme')) {
            setCreativeTheme(params.get('theme'), false);
        }

        if (params.get('lang')) {
            const lang = params.get('lang');
            if (['vi', 'en', 'zh'].includes(lang)) {
                setLanguage(lang, () => {
                    updateDefaultTagNames();
                    renderTagChoicesUI();
                    syncAllViews();
                });
            }
        }

        // Tùy chọn ẩn Header nếu trang cha đã có Header riêng
        if (params.get('hideHeader') === 'true') {
            const header = document.querySelector('header');
            if (header) header.style.display = 'none';
        }

        // Tự động tải ảnh từ URL truyền qua Query Param
        if (params.get('img')) {
            loadImageFromUrl(params.get('img'), params.get('imgName'));
        }
    } catch (e) {
        console.warn('Error parsing iframe URL parameters', e);
    }
}

/**
 * Lắng nghe các lệnh từ trang web cha gửi vào iframe
 */
export function setupIframeMessageListener() {
    window.addEventListener('message', (event) => {
        const msg = event.data;
        if (!msg || typeof msg !== 'object') return;

        const action = msg.action || msg.type;

        switch (action) {
            case 'LOAD_IMAGE':
            case 'SET_IMAGE':
                if (msg.url || msg.image_url) {
                    loadImageFromUrl(msg.url || msg.image_url, msg.name || msg.image_name);
                }
                break;

            case 'IMPORT_JSON':
            case 'LOAD_JSON':
                if (msg.json || msg.data) {
                    const result = importJsonData(msg.json || msg.data, msg.mode || 'replace');
                    notifyParent('JSON_IMPORTED', result);
                }
                break;

            case 'GET_DATA':
            case 'REQUEST_DATA':
                notifyParent('DATA_RESPONSE', {
                    data: getFormattedExportData(),
                    databaseRows: generateDatabaseRows(),
                    totalBoxes: state.boundingBoxes.length
                });
                break;

            case 'SET_MODE':
                if (msg.mode) setColorMode(msg.mode, true);
                break;

            case 'SET_LANG':
            case 'SET_LANGUAGE':
                if (msg.lang) {
                    setLanguage(msg.lang, () => {
                        updateDefaultTagNames();
                        renderTagChoicesUI();
                        syncAllViews();
                    });
                }
                break;

            case 'SET_THEME':
                if (msg.theme) setCreativeTheme(msg.theme, true);
                break;

            case 'CLEAR_ALL':
                clearAllBoxes();
                break;

            case 'PING':
                notifyParent('PONG', { version: '3.2.0' });
                break;
        }
    });

    // Thông báo cho trang cha biết iframe đã tải xong và sẵn sàng nhận lệnh
    notifyParent('BBOX_READY', {
        version: '3.2.0',
        availableActions: ['LOAD_IMAGE', 'IMPORT_JSON', 'GET_DATA', 'SET_MODE', 'SET_LANGUAGE', 'SET_THEME', 'CLEAR_ALL']
    });
}
