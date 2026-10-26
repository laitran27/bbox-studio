# 🖼️ Hướng Dẫn Tích Hợp BBox Creative Studio Qua iFrame

Tài liệu này hướng dẫn chi tiết cách nhúng công cụ **BBox Creative Studio** vào bất kỳ trang web hoặc hệ thống quản trị hiện có (React, Vue, Angular, Laravel, Django, WordPress, Node.js, HTML thuần) thông qua thẻ HTML `<iframe>`.

---

## 📑 Mục Lục
1. [Ưu Điểm Khi Tích Hợp Qua iFrame](#1-ưu-điểm-khi-tích-hợp-qua-iframe)
2. [Cách Nhúng Cơ Bản (Quick Start)](#2-cách-nhúng-cơ-bản-quick-start)
3. [Cấu Hình Qua Tham Số URL (Query Parameters)](#3-cấu-hình-qua-tham-số-url-query-parameters)
4. [Giao Tiếp 2 Chiều Qua `window.postMessage` API](#4-giao-tiếp-2-chiều-qua-windowpostmessage-api)
   - [A. Trang Cha Gửi Lệnh Vào iFrame (Parent ➔ iFrame)](#a-trang-cha-gửi-lệnh-vào-iframe-parent--iframe)
   - [B. iFrame Gửi Sự Kiện Ra Trang Cha (iFrame ➔ Parent)](#b-iframe-gửi-sự-kiện-ra-trang-cha-iframe--parent)
5. [Cấu Trúc Dữ Liệu Trả Về (Data Payload)](#5-cấu-trúc-dữ-liệu-trả-về-data-payload)
6. [Mã Nguồn Mẫu Tích Hợp Thực Tế](#6-mã-nguồn-mẫu-tích-hợp-thực-tế)
   - [Ví Dụ 1: JavaScript Thuần (Vanilla JS)](#ví-dụ-1-javascript-thuần-vanilla-js)
   - [Ví Dụ 2: React Component (React 18+)](#ví-dụ-2-react-component-react-18)
   - [Ví Dụ 3: Vue 3 Component (Composition API)](#ví-dụ-3-vue-3-component-composition-api)
7. [Cấu Hình Bảo Mật & CORS (Security & CSP)](#7-cấu-hình-bảo-mật--cors-security--csp)
8. [Trang Demo Mẫu Có Sẵn](#8-trang-demo-mẫu-có-sẵn)

---

## 1. Ưu Điểm Khi Tích Hợp Qua iFrame

- **Độc lập hoàn toàn**: Không sợ xung đột CSS (Tailwind, Bootstrap), không xung đột thư viện JavaScript.
- **Dễ dàng bảo trì & nâng cấp**: Cập nhật mã nguồn BBox Studio mà không ảnh hưởng đến hệ thống web cha.
- **Tương thích mọi nền tảng**: Nhúng được vào mọi framework Frontend hoặc Backend CMS.
- **Giao tiếp mượt mà theo thời gian thực**: Tự động báo số lượng khung vẽ, nạp ảnh từ URL, nạp JSON và lấy dữ liệu lưu vào Database trang cha chỉ với 1 dòng lệnh.

---

## 2. Cách Nhúng Cơ Bản (Quick Start)

Chèn thẻ `<iframe>` vào vị trí bạn muốn hiển thị trên trang web:

```html
<iframe id="bboxFrame"
        src="http://localhost:3000/index.html?mode=system&lang=vi"
        width="100%"
        height="700px"
        style="border: none; border-radius: 16px; overflow: hidden;"
        allow="clipboard-write; clipboard-read"
        title="BBox Creative Studio Widget">
</iframe>
```

> [!IMPORTANT]
> **Thuộc tính `allow="clipboard-write; clipboard-read"`**: Bắt buộc thêm vào để tính năng Sao chép Clipboard của BBox Studio hoạt động bình thường trong môi trường iframe.

---

## 3. Cấu Hình Qua Tham Số URL (Query Parameters)

Bạn có thể truyền trực tiếp các cấu hình ban đầu ngay trên thuộc tính `src` của iframe:

| Tham số | Giá trị hỗ trợ | Mặc định | Ý nghĩa & Mô tả |
| :--- | :--- | :---: | :--- |
| **`lang`** | `vi`, `en`, `zh` | `vi` | Ngôn ngữ giao diện (Tiếng Việt, Tiếng Anh, Tiếng Trung) |
| **`mode`** | `light`, `dark`, `system` | `system` | Chế độ giao diện Sáng / Tối / Tự thích ứng theo Hệ điều hành |
| **`theme`** | `sunset`, `tropical`, `berry` | `sunset` | Bảng màu chủ đề sáng tạo |
| **`hideHeader`** | `true`, `false` | `false` | Ẩn thanh Header trên cùng nếu website cha đã có thanh Header riêng |
| **`img`** | URL hình ảnh | *(Trống)* | Tự động nạp sẵn ảnh từ đường dẫn trực tuyến ngay khi mở |
| **`imgName`** | Tên file ảnh (String) | `image.png` | Tên tệp ảnh hiển thị trên thanh công cụ |

### Ví dụ URL nâng cao:
```html
<!-- Nhúng giao diện Tối (Dark), tiếng Việt, ẩn Header, tự nạp ảnh sản phẩm -->
<iframe src="http://localhost:3000/index.html?mode=dark&lang=vi&hideHeader=true&img=https://my-cdn.com/products/shoes-01.png&imgName=Giay_The_Thao.png"
        width="100%"
        height="720px">
</iframe>
```

---

## 4. Giao Tiếp 2 Chiều Qua `window.postMessage` API

Trang cha và iFrame giao tiếp với nhau bằng chuẩn an toàn `window.postMessage`.

### A. Trang Cha Gửi Lệnh Vào iFrame (Parent ➔ iFrame)

Cú pháp gửi lệnh từ trang cha:
```javascript
const iframe = document.getElementById('bboxFrame');
iframe.contentWindow.postMessage({ action: 'TÊN_LỆNH', ...payload }, '*');
```

Các lệnh được hỗ trợ:

#### 1. Nạp ảnh mới từ URL (`LOAD_IMAGE`)
```javascript
iframe.contentWindow.postMessage({
    action: 'LOAD_IMAGE',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000',
    name: 'Nike_Red_Shoe.png'
}, '*');
```

#### 2. Nạp dữ liệu JSON tọa độ (`IMPORT_JSON`)
Tự động vẽ các khung lên ảnh (hỗ trợ cả các Tag mới trong `categories`):
```javascript
iframe.contentWindow.postMessage({
    action: 'IMPORT_JSON',
    json: {
        categories: [
            { id: "logo", name: "Logo Thương Hiệu", color: "#ff2a6d", icon: "✨" }
        ],
        annotations: [
            {
                tag_name: "Logo Thương Hiệu",
                coordinates: { x: 120, y: 150, width: 220, height: 140 },
                note: "Vùng nhận diện logo chính"
            }
        ]
    },
    mode: 'replace' // 'replace' (thay thế hết) hoặc 'append' (vẽ thêm vào khung cũ)
}, '*');
```

#### 3. Yêu cầu lấy dữ liệu lưu vào Database (`GET_DATA`)
Yêu cầu iFrame trả về danh sách khung hiện có kèm tọa độ và dữ liệu chuẩn 23 cột Database:
```javascript
iframe.contentWindow.postMessage({ action: 'GET_DATA' }, '*');
```

#### 4. Đổi chế độ Sáng / Tối (`SET_MODE`)
```javascript
iframe.contentWindow.postMessage({ action: 'SET_MODE', mode: 'dark' }, '*'); // 'light' | 'dark' | 'system'
```

#### 5. Đổi ngôn ngữ hiển thị (`SET_LANG`)
```javascript
iframe.contentWindow.postMessage({ action: 'SET_LANG', lang: 'en' }, '*'); // 'vi' | 'en' | 'zh'
```

#### 6. Đổi bảng màu chủ đề (`SET_THEME`)
```javascript
iframe.contentWindow.postMessage({ action: 'SET_THEME', theme: 'tropical' }, '*'); // 'sunset' | 'tropical' | 'berry'
```

#### 7. Xóa toàn bộ khung đang vẽ (`CLEAR_ALL`)
```javascript
iframe.contentWindow.postMessage({ action: 'CLEAR_ALL' }, '*');
```

#### 8. Kiểm tra kết nối (`PING`)
```javascript
iframe.contentWindow.postMessage({ action: 'PING' }, '*');
```

---

### B. iFrame Gửi Sự Kiện Ra Trang Cha (iFrame ➔ Parent)

Trên trang cha, lắng nghe sự kiện `message`:

```javascript
window.addEventListener('message', (event) => {
    const msg = event.data;
    if (!msg || typeof msg !== 'object') return;

    // Lọc đúng nguồn phát từ BBox Studio
    if (msg.source === 'bbox-creative-studio') {
        console.log('Nhận tin nhắn từ BBox Studio:', msg.type, msg);
    }
});
```

Các sự kiện do iFrame phát ra:

| Tên sự kiện (`msg.type`) | Dữ liệu kèm theo | Khi nào phát ra? |
| :--- | :--- | :--- |
| **`BBOX_READY`** | `{ version: '3.2.0', totalBoxes: 0 }` | Khi iFrame vừa tải xong toàn bộ DOM và sẵn sàng nhận lệnh từ trang cha |
| **`BOXES_UPDATED`** | `{ count: 3 }` | Phát ra mỗi khi người dùng vẽ thêm khung mới, xóa khung, kéo di chuyển hoặc đổi Tag |
| **`DATA_RESPONSE`** | `{ data: {...}, databaseRows: [...], totalBoxes: 3 }` | Phản hồi lại lệnh `GET_DATA` của trang cha, chứa đầy đủ JSON và mảng dòng Database |
| **`JSON_IMPORTED`** | `{ success: true, count: 2 }` | Phản hồi lại khi nạp file/chuỗi JSON thành công |
| **`PONG`** | `{ version: '3.2.0' }` | Phản hồi lại lệnh `PING` kiểm tra kết nối |

---

## 5. Cấu Trúc Dữ Liệu Trả Về (Data Payload)

Khi trang cha gọi lệnh `GET_DATA`, iFrame sẽ phản hồi bằng sự kiện `DATA_RESPONSE` chứa 2 định dạng dữ liệu cực kỳ tiện lợi:

### 1. `msg.data` (Chuẩn JSON Hierarchical)
```json
{
  "image_name": "Nike_Red_Shoe.png",
  "image_width": 1000,
  "image_height": 667,
  "total_boxes": 1,
  "categories": [
    {
      "id": "logo",
      "class_id": 0,
      "name": "Logo Thương Hiệu",
      "color": "#ff2a6d",
      "icon": "✨"
    }
  ],
  "annotations": [
    {
      "index": 1,
      "tag_id": "logo",
      "class_id": 0,
      "tag_name": "Logo Thương Hiệu",
      "date_iso": "2026-10-26",
      "date_vn": "26/10/2026",
      "note": "Vùng logo chính",
      "coordinates": {
        "x": 120,
        "y": 150,
        "width": 220,
        "height": 140,
        "xmax": 340,
        "ymax": 290
      },
      "yolo_normalized": {
        "class_id": 0,
        "x_center": 0.2300,
        "y_center": 0.3298,
        "width": 0.2200,
        "height": 0.2099
      }
    }
  ]
}
```

### 2. `msg.databaseRows` (Chuẩn Bảng 23 Cột để Insert SQL / MongoDB)
Mảng các đối tượng phẳng (flat objects) sẵn sàng gửi lên Backend API hoặc lệnh SQL `INSERT`:
```json
[
  {
    "ID": "1793001234567",
    "STT": 1,
    "IMAGE_NAME": "Nike_Red_Shoe.png",
    "IMAGE_WIDTH": 1000,
    "IMAGE_HEIGHT": 667,
    "TAG_ID": "logo",
    "CLASS_ID": 0,
    "TAG_NAME": "Logo Thương Hiệu",
    "TAG_ICON": "✨",
    "DATE_ISO": "2026-10-26",
    "DATE_VN": "26/10/2026",
    "NOTE": "Vùng logo chính",
    "X": 120,
    "Y": 150,
    "WIDTH": 220,
    "HEIGHT": 140,
    "X_MAX": 340,
    "Y_MAX": 290,
    "X_CENTER_NORM": 0.23,
    "Y_CENTER_NORM": 0.3298,
    "WIDTH_NORM": 0.22,
    "HEIGHT_NORM": 0.2099,
    "CREATED_AT": "2026-10-26T08:15:00.000Z"
  }
]
```

---

## 6. Mã Nguồn Mẫu Tích Hợp Thực Tế

### Ví Dụ 1: JavaScript Thuần (Vanilla JS)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Trang Quản Trị - Tích Hợp BBox</title>
</head>
<body>
    <h2>Đóng Khung Kiểm Tra Sản Phẩm</h2>
    <button id="btnSaveDB">Lưu Tọa Độ Vào Database</button>

    <iframe id="bboxFrame"
            src="./index.html?mode=light&lang=vi&hideHeader=true"
            width="100%"
            height="650px"
            allow="clipboard-write; clipboard-read">
    </iframe>

    <script>
        const iframe = document.getElementById('bboxFrame');

        // Bấm nút lưu -> Gửi yêu cầu lấy dữ liệu từ iframe
        document.getElementById('btnSaveDB').addEventListener('click', () => {
            iframe.contentWindow.postMessage({ action: 'GET_DATA' }, '*');
        });

        // Lắng nghe dữ liệu trả về từ iframe
        window.addEventListener('message', async (event) => {
            const msg = event.data;
            if (msg.source === 'bbox-creative-studio' && msg.type === 'DATA_RESPONSE') {
                console.log('Dữ liệu đã nhận:', msg.databaseRows);
                
                // Gửi lên REST API của bạn
                const res = await fetch('/api/save-annotations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageName: msg.data.image_name,
                        annotations: msg.databaseRows
                    })
                });
                alert('Đã lưu thành công ' + msg.totalBoxes + ' khung vào Database!');
            }
        });
    </script>
</body>
</html>
```

---

### Ví Dụ 2: React Component (React 18+)

```tsx
import React, { useRef, useEffect, useState } from 'react';

export const BBoxAnnotationWidget: React.FC<{ imageUrl?: string; onSave?: (data: any) => void }> = ({ imageUrl, onSave }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [boxCount, setBoxCount] = useState(0);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const msg = event.data;
            if (!msg || msg.source !== 'bbox-creative-studio') return;

            if (msg.type === 'BBOX_READY') {
                // Khi iframe sẵn sàng, tự nạp ảnh truyền từ props
                if (imageUrl && iframeRef.current) {
                    iframeRef.current.contentWindow?.postMessage({
                        action: 'LOAD_IMAGE',
                        url: imageUrl,
                        name: 'product_image.png'
                    }, '*');
                }
            }

            if (msg.type === 'BOXES_UPDATED') {
                setBoxCount(msg.count);
            }

            if (msg.type === 'DATA_RESPONSE') {
                if (onSave) onSave(msg);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [imageUrl, onSave]);

    const handleRequestSave = () => {
        iframeRef.current?.contentWindow?.postMessage({ action: 'GET_DATA' }, '*');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Đã vẽ: <strong>{boxCount}</strong> khung</span>
                <button onClick={handleRequestSave} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    Lưu Vào Database
                </button>
            </div>

            <iframe
                ref={iframeRef}
                src="/index.html?mode=system&lang=vi&hideHeader=true"
                width="100%"
                height="680px"
                style={{ border: '1px solid #e2e8f0', borderRadius: 16 }}
                allow="clipboard-write; clipboard-read"
                title="BBox Annotator"
            />
        </div>
    );
};
```

---

### Ví Dụ 3: Vue 3 Component (Composition API)

```vue
<template>
  <div class="bbox-container">
    <div class="header-bar">
      <span>Số khung: <strong>{{ boxCount }}</strong></span>
      <button @click="saveData" class="btn-save">Lưu Dữ Liệu</button>
    </div>

    <iframe
      ref="bboxIframe"
      src="/index.html?mode=system&lang=vi&hideHeader=true"
      class="bbox-frame"
      allow="clipboard-write; clipboard-read"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const bboxIframe = ref(null);
const boxCount = ref(0);
const emit = defineEmits(['save']);

const onMessage = (event) => {
  const msg = event.data;
  if (!msg || msg.source !== 'bbox-creative-studio') return;

  if (msg.type === 'BOXES_UPDATED') {
    boxCount.value = msg.count;
  }
  if (msg.type === 'DATA_RESPONSE') {
    emit('save', msg);
  }
};

onMounted(() => window.addEventListener('message', onMessage));
onUnmounted(() => window.removeEventListener('message', onMessage));

const saveData = () => {
  bboxIframe.value?.contentWindow?.postMessage({ action: 'GET_DATA' }, '*');
};
</script>

<style scoped>
.bbox-container { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.bbox-frame { width: 100%; height: 680px; border: 1px solid #cbd5e1; border-radius: 16px; }
.btn-save { padding: 8px 16px; background: #059669; color: white; border-radius: 8px; border: none; cursor: pointer; }
</style>
```

---

## 7. Cấu Hình Bảo Mật & CORS (Security & CSP)

Nếu trang web của bạn chạy ở một domain khác (khác domain máy chủ BBox Studio), hãy lưu ý 2 điểm sau:

### 1. Cho phép nhúng iframe (HTTP Response Header)
Đảm bảo máy chủ phục vụ BBox Studio **không** chặn iframe bằng `X-Frame-Options: DENY`. Cấu hình header trên Nginx / Apache / Node.js:
```http
Content-Security-Policy: frame-ancestors 'self' https://your-main-website.com;
```
*(Hoặc bỏ qua header này nếu chạy cùng domain / localhost).*

### 2. Chỉ định rõ `targetOrigin` trong môi trường Production
Trong môi trường production bảo mật cao, bạn có thể thay thế dấu `'*'` bằng domain chính xác của website cha:
```javascript
// Gửi tới đúng domain trang web cha
window.parent.postMessage({ source: 'bbox-creative-studio', ... }, 'https://your-main-website.com');
```

---

## 8. Trang Demo Mẫu Có Sẵn

Trong thư mục dự án đã có sẵn trang demo hoàn chỉnh minh họa giao tiếp 2 chiều:
- **Tệp nguồn:** [`iframe_demo.html`](file:///d:/AIGen/Conner/iframe_demo.html)
- **Truy cập thử nghiệm trên trình duyệt:** [http://localhost:3000/iframe_demo.html](http://localhost:3000/iframe_demo.html)

Trang demo này có sẵn:
1. Nút nạp ảnh mẫu từ URL vào iframe.
2. Nút gửi chuỗi JSON có sẵn khung vào iframe để tự động vẽ.
3. Nút yêu cầu iframe trả về dữ liệu và hiển thị trực tiếp lên bảng JSON/Database của trang cha.
4. Nút đổi giao diện Dark/Light của iframe từ trang cha.
5. Cột nhật ký (Event Logs) ghi lại tất cả tin nhắn giao tiếp giữa 2 bên theo thời gian thực.
