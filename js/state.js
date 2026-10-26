// ==========================================
// QUẢN LÝ TRẠNG THÁI TOÀN CỤC (APPLICATION STATE)
// ==========================================

import { getOffsetDateISO } from './utils.js';

export const defaultTagChoices = [
    { id: 'person',   classId: 0, name: 'Người (Person)',           color: '#ff2a6d', icon: '👤' },
    { id: 'face',     classId: 1, name: 'Khuôn mặt (Face)',         color: '#ff7b00', icon: '😊' },
    { id: 'vehicle',  classId: 2, name: 'Xe cộ (Vehicle)',          color: '#9333ea', icon: '🚗' },
    { id: 'device',   classId: 3, name: 'Thiết bị / Điện tử',       color: '#f43f5e', icon: '💻' },
    { id: 'object',   classId: 4, name: 'Đồ vật / Đồ uống',         color: '#10b981', icon: '🍹' },
    { id: 'animal',   classId: 5, name: 'Động vật (Animal)',        color: '#f59e0b', icon: '🐾' },
    { id: 'text',     classId: 6, name: 'Văn bản / Biển hiệu',      color: '#ec4899', icon: '🔤' },
    { id: 'defect',   classId: 7, name: 'Điểm lỗi (Defect)',        color: '#e11d48', icon: '⚠️' },
    { id: 'other',    classId: 8, name: 'Khác (Other)',             color: '#a855f7', icon: '📌' }
];

export const state = {
    tagChoices: [...defaultTagChoices],
    activeTagId: defaultTagChoices[0].id,
    defaultBoxDate: getOffsetDateISO(0),

    currentImage: null,
    currentImageName: 'image.png',
    boundingBoxes: [],
    selectedBoxId: null,
    hoveredBoxId: null,
    boxCounter: 1,
    fitToScreen: true,

    // Trạng thái kéo vẽ khung mới hoặc di chuyển / co giãn khung hiện có
    interactionMode: null, // 'draw' | 'move' | 'resize'
    activeResizeHandle: null, // 'nw' | 'ne' | 'sw' | 'se'
    interactingBoxId: null,
    startCoords: { x: 0, y: 0 },
    currentCoords: { x: 0, y: 0 },
    initialBoxRect: null
};

/**
 * Tìm tag theo id, fallback về tag đầu tiên nếu không tìm thấy
 * @param {string} tagId
 * @returns {object} Thông tin tag
 */
export function getTagById(tagId) {
    return state.tagChoices.find(t => t.id === tagId) || state.tagChoices[0];
}
