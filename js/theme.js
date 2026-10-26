// ==========================================
// QUẢN LÝ BẢNG MÀU CHỦ ĐỀ & CHẾ ĐỘ SÁNG / TỐI / HỆ THỐNG
// (THEME & COLOR MODE SWITCHER)
// ==========================================

import { showToast } from './utils.js';
import { t } from './i18n.js';

const STORAGE_KEY_MODE = 'bbox_studio_color_mode';
const STORAGE_KEY_THEME = 'bbox_studio_creative_theme';

let currentColorMode = 'system'; // 'light' | 'dark' | 'system'
let currentCreativeTheme = 'sunset'; // 'sunset' | 'tropical' | 'neon'
let mediaQueryList = null;

/**
 * Kiểm tra xem chế độ hệ thống hiện tại có phải là dark mode không
 * @returns {boolean}
 */
export function isSystemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Lấy chế độ màu hiển thị thực tế ('light' hoặc 'dark')
 * @returns {'light'|'dark'}
 */
export function getEffectiveColorMode() {
    if (currentColorMode === 'system') {
        return isSystemDark() ? 'dark' : 'light';
    }
    return currentColorMode;
}

/**
 * Lấy chế độ màu người dùng đã chọn ('light' | 'dark' | 'system')
 * @returns {'light'|'dark'|'system'}
 */
export function getColorMode() {
    return currentColorMode;
}

/**
 * Cập nhật giao diện nút bấm Sáng / Tối / Hệ thống trên thanh điều hướng
 */
export function updateModeSwitcherUI() {
    const modes = ['light', 'dark', 'system'];
    modes.forEach(m => {
        const btn = document.getElementById(`modeBtn-${m}`);
        if (!btn) return;
        if (m === currentColorMode) {
            btn.className = 'px-2 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm cursor-pointer scale-100';
        } else {
            btn.className = 'px-2 py-1 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-700/80 transition flex items-center gap-1 cursor-pointer';
        }
    });
}

/**
 * Áp dụng class `dark` lên html & body dựa trên effective mode
 */
function applyDarkClassToDOM() {
    const effective = getEffectiveColorMode();
    const root = document.documentElement;
    const body = document.body;

    if (effective === 'dark') {
        root.classList.add('dark');
        if (body) body.classList.add('dark');
    } else {
        root.classList.remove('dark');
        if (body) body.classList.remove('dark');
    }
}

/**
 * Đổi chế độ màu: 'light' (Sáng), 'dark' (Tối), 'system' (Theo hệ thống OS)
 * @param {'light'|'dark'|'system'} mode
 * @param {boolean} showNotification
 */
export function setColorMode(mode, showNotification = true) {
    if (!['light', 'dark', 'system'].includes(mode)) {
        mode = 'system';
    }

    currentColorMode = mode;
    try {
        localStorage.setItem(STORAGE_KEY_MODE, mode);
    } catch (e) {
        console.warn('Cannot save color mode to localStorage', e);
    }

    applyDarkClassToDOM();
    updateModeSwitcherUI();

    if (showNotification) {
        let msg = t('toast_mode_system');
        if (mode === 'light') msg = t('toast_mode_light');
        if (mode === 'dark') msg = t('toast_mode_dark');
        showToast(msg, mode === 'dark' ? 'purple' : 'rose');
    }
}

/**
 * Khởi tạo chế độ Sáng/Tối/Hệ thống khi load trang
 */
export function initColorMode() {
    let savedMode = 'system';
    try {
        const stored = localStorage.getItem(STORAGE_KEY_MODE);
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            savedMode = stored;
        }
    } catch (e) {
        console.warn('Cannot read color mode from localStorage', e);
    }

    // Lắng nghe sự thay đổi giao diện từ hệ điều hành khi ở chế độ System
    if (window.matchMedia) {
        mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const handleOsThemeChange = () => {
            if (currentColorMode === 'system') {
                applyDarkClassToDOM();
            }
        };
        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener('change', handleOsThemeChange);
        } else if (mediaQueryList.addListener) {
            mediaQueryList.addListener(handleOsThemeChange);
        }
    }

    setColorMode(savedMode, false);

    // Khởi tạo cả creative theme đã lưu (nếu có)
    let savedTheme = 'sunset';
    try {
        const storedTheme = localStorage.getItem(STORAGE_KEY_THEME);
        if (storedTheme && ['sunset', 'tropical', 'neon'].includes(storedTheme)) {
            savedTheme = storedTheme;
        }
    } catch (e) {
        console.warn('Cannot read creative theme from localStorage', e);
    }
    setCreativeTheme(savedTheme, false);
}

/**
 * Đổi bảng màu sáng tạo (Creative Theme): Sunset, Tropical, Neon
 * @param {'sunset'|'tropical'|'neon'} themeName
 * @param {boolean} showNotification
 */
export function setCreativeTheme(themeName, showNotification = true) {
    if (!['sunset', 'tropical', 'neon'].includes(themeName)) {
        themeName = 'sunset';
    }

    currentCreativeTheme = themeName;
    try {
        localStorage.setItem(STORAGE_KEY_THEME, themeName);
    } catch (e) {
        console.warn('Cannot save creative theme to localStorage', e);
    }

    const body = document.body;
    if (body) {
        body.classList.remove('theme-tropical', 'theme-neon');
        if (themeName === 'tropical') body.classList.add('theme-tropical');
        if (themeName === 'neon') body.classList.add('theme-neon');
    }

    const themeSelect = document.getElementById('creativeThemeSelect');
    if (themeSelect && themeSelect.value !== themeName) {
        themeSelect.value = themeName;
    }

    ['sunset', 'tropical', 'neon'].forEach(tKey => {
        const btn = document.getElementById(`themeBtn-${tKey}`);
        if (!btn) return;
        if (tKey === themeName) {
            btn.className = 'px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm cursor-pointer';
        } else {
            btn.className = 'px-2.5 py-1 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white/70 dark:hover:bg-stone-700/70 transition flex items-center gap-1.5 cursor-pointer';
        }
    });

    if (showNotification) {
        showToast(`Đã đổi sang bảng màu sáng tạo: ${themeName.toUpperCase()}!`, 'rose');
    }
}
