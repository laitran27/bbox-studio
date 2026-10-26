// ==========================================
// HÀM TIỆN ÍCH DÙNG CHUNG (HELPERS & UTILITIES)
// ==========================================

/**
 * Lấy chuỗi ngày định dạng YYYY-MM-DD dựa trên độ lệch ngày so với hôm nay
 * @param {number} daysOffset - Số ngày cộng/trừ (0 = hôm nay, -1 = hôm qua, v.v.)
 * @returns {string} Chuỗi ngày ISO (YYYY-MM-DD)
 */
export function getOffsetDateISO(daysOffset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

/**
 * Chuyển đổi chuỗi ISO YYYY-MM-DD sang định dạng ngày Việt Nam DD/MM/YYYY
 * @param {string} isoDate - Chuỗi ngày YYYY-MM-DD
 * @returns {string} Chuỗi ngày DD/MM/YYYY
 */
export function formatDateVN(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Nhận diện mốc preset (today, yesterday, 3days, week, tomorrow, custom) từ ngày ISO
 * @param {string} isoDate - Chuỗi ngày ISO
 * @returns {string} Mã mốc preset
 */
export function detectDatePresetValue(isoDate) {
    if (isoDate === getOffsetDateISO(0)) return 'today';
    if (isoDate === getOffsetDateISO(-1)) return 'yesterday';
    if (isoDate === getOffsetDateISO(-3)) return '3days';
    if (isoDate === getOffsetDateISO(-7)) return 'week';
    if (isoDate === getOffsetDateISO(1)) return 'tomorrow';
    return 'custom';
}

/**
 * Chuyển đổi mã màu hex (#RRGGBB) sang rgba(r, g, b, alpha)
 * @param {string} hex - Mã màu hex
 * @param {number} alpha - Độ trong suốt (0 đến 1)
 * @returns {string} Chuỗi rgba(...)
 */
export function hexToRgba(hex, alpha) {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Thoát các ký tự đặc biệt trong HTML để phòng tránh XSS
 * @param {string} str - Chuỗi văn bản
 * @returns {string} Chuỗi đã được escape an toàn
 */
export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

let toastTimeout = null;

/**
 * Hiển thị thông báo Toast nổi sinh động ở giữa đáy màn hình
 * @param {string} message - Nội dung thông báo
 * @param {'emerald'|'rose'|'orange'|'amber'|'purple'} color - Màu chỉ báo
 */
export function showToast(message, color = 'emerald') {
    const toast = document.getElementById('toastNotification');
    const icon = document.getElementById('toastIcon');
    const msgEl = document.getElementById('toastMessage');

    if (!toast || !icon || !msgEl) return;

    const colorMap = {
        emerald: 'bg-emerald-400',
        rose: 'bg-rose-400',
        orange: 'bg-orange-400',
        amber: 'bg-amber-400',
        purple: 'bg-purple-400'
    };

    icon.className = `w-2.5 h-2.5 rounded-full ${colorMap[color] || 'bg-rose-400'}`;
    msgEl.textContent = message;

    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2800);
}

/**
 * Sao chép văn bản an toàn vào Clipboard (tương thích cả trong iframe & trình duyệt)
 * @param {string} text - Văn bản cần sao chép
 * @param {string} successMsg - Thông báo thành công
 */
export function copyTextSafe(text, successMsg) {
    const hiddenInput = document.getElementById('hiddenClipboardInput');
    if (!hiddenInput) return;

    hiddenInput.value = text;
    hiddenInput.select();
    hiddenInput.setSelectionRange(0, 999999);

    try {
        document.execCommand('copy');
        showToast(successMsg, 'emerald');
    } catch (err) {
        showToast('Không thể sao chép tự động, hãy bôi đen khung JSON!', 'rose');
    }
}

// ==========================================
// QUẢN LÝ CÁC COMBO DROPDOWN NỔI (TỆP & XUẤT FILE)
// ==========================================

export function closeAllDropdowns() {
    const fileMenu = document.getElementById('fileDropdownMenu');
    const exportMenu = document.getElementById('exportDropdownMenu');
    if (fileMenu) fileMenu.classList.add('hidden');
    if (exportMenu) exportMenu.classList.add('hidden');
}

export function toggleFileDropdown(event) {
    if (event) event.stopPropagation();
    const fileMenu = document.getElementById('fileDropdownMenu');
    const exportMenu = document.getElementById('exportDropdownMenu');
    if (exportMenu) exportMenu.classList.add('hidden');
    if (fileMenu) {
        fileMenu.classList.toggle('hidden');
    }
}

export function toggleExportDropdown(event) {
    if (event) event.stopPropagation();
    const fileMenu = document.getElementById('fileDropdownMenu');
    const exportMenu = document.getElementById('exportDropdownMenu');
    if (fileMenu) fileMenu.classList.add('hidden');
    if (exportMenu) {
        exportMenu.classList.toggle('hidden');
    }
}

export function initDropdownListeners() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#fileMenuContainer') && !e.target.closest('#exportMenuContainer')) {
            closeAllDropdowns();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });
}
