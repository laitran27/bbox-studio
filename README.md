<div align="center">

# 🎨 BBox Studio
### ⚡ Lightweight, Zero-Dependency Web Image Annotation & Bounding Box Tool
**Công cụ trực quan đóng khung hình ảnh, phân loại Tag (kèm ID & Màu), gán ngày tháng và kết xuất dữ liệu YOLO / Excel / JSON**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20JS)-orange.svg)](#)
[![Multi-Language](https://img.shields.io/badge/Language-VI%20%7C%20EN%20%7C%20ZH-rose.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Light%20%7C%20Dark%20%7C%20System-purple.svg)](#)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue.svg)](https://laitran27.github.io/bbox-studio/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](#)

[**🚀 Trải Nghiệm Trực Tiếp (Live Demo)**](https://laitran27.github.io/bbox-studio/) • [**📖 Hướng Dẫn Sử Dụng**](#-hướng-dẫn-sử-dụng-chi-tiết-từ-a---z) • [**📘 Hướng Dẫn Tích Hợp IFrame**](README_IFRAME.md) • [**📊 Chuẩn Xuất Excel & YOLO**](#-bảng-quy-chuẩn-23-cột-dữ-liệu-excel--database)

</div>

---

## 🌟 Giới Thiệu (Overview)

**BBox Studio** là công cụ đóng khung ảnh (**Bounding Box Annotation Tool**) chạy trực tiếp 100% trên trình duyệt (Client-side), thuần HTML5/Canvas/JavaScript, **không cần cài đặt thư viện nặng hay thiết lập backend phức tạp**. 

Công cụ được thiết kế tối ưu cho:
- 🤖 **Kỹ sư AI / Computer Vision / Machine Learning**: Gán nhãn dữ liệu huấn luyện YOLO, Object Detection, trích xuất tọa độ chuẩn hóa 0–1.
- 🏭 **Nhóm Kiểm Thử / Quản Lý Chất Lượng (QA / QC)**: Đánh dấu lỗi sản phẩm, biển số xe, barcode, đính kèm ngày kiểm tra và ghi chú.
- 💻 **Nhà phát triển Web / Doanh nghiệp**: Nhúng nguyên khối công cụ vào các hệ thống quản trị nội bộ (ERP, CRM, DMS, Web App) qua thẻ `<iframe>` với API 2 chiều linh hoạt.

---

## 📖 Hướng Dẫn Sử Dụng Chi Tiết (Từ A - Z)

### Bước 1: Nạp hình ảnh vào ứng dụng
Có 3 cách để mở ảnh:
1. **Tải ảnh từ máy tính**: Bấm nút **"Tải ảnh lên"** trên thanh tiêu đề và chọn bất kỳ tệp ảnh nào (`.jpg`, `.png`, `.webp`, `.bmp`).
2. **Kéo thả trực tiếp**: Kéo ảnh từ thư mục máy tính và thả thẳng vào khu vực Canvas.
3. **Mở ảnh mẫu có sẵn (Demo)**: Bấm vào mũi tên cạnh nút *Tải ảnh lên* $\rightarrow$ Chọn **"Tải ảnh Demo mẫu"** để thử nghiệm ngay lập tức.

---

### Bước 2: Thiết lập & Quản lý Danh Mục Tag (Nhãn)
Hệ thống cho phép gán nhãn chuyên sâu với định dạng chuẩn **`ID-Tên tag`**:
- **Chọn nhanh Tag đang dùng**: Nhấp vào các nút chip Tag trên thanh công cụ hoặc bấm phím số từ `1` đến `9`.
- **Tạo Tag mới**:
  1. Bấm vào nút **"⚙️ Quản lý Tag"**.
  2. Điền: **Icon** (chọn nhanh trong bảng 35 emoji), **Mã Tag (ID)** (ví dụ: `defect_01`, `P01`, `license_plate`), **Tên Tag** và **Màu khung viền**.
  3. Bấm **"+ Thêm vào danh sách Choice & Chọn ngay"**.
- **Chỉnh sửa / Đổi ID của Tag có sẵn**:
  - Trong cửa sổ Quản lý Tag, bạn có thể sửa trực tiếp Mã ID, Tên, Màu của bất kỳ nhãn nào. Toàn bộ các khung đã vẽ trên ảnh sẽ **tự động cập nhật đồng bộ**.
- **Nạp / Xuất danh mục Tag qua file Excel (`.xlsx`)**:
  - Bấm **"📄 Tải Template Mẫu (.xlsx)"** để tải file Excel có sẵn cấu trúc cột chuẩn.
  - Bấm **"📊 Nhập Tag từ Excel / CSV"** để nạp hàng chục đến hàng trăm nhãn Tag vào hệ thống chỉ trong 1 giây.
  - Bấm **"📤 Xuất Danh Sách Tag"** để lưu trữ bảng nhãn hiện tại.

---

### Bước 3: Đóng khung ảnh (Vẽ & Tinh Chỉnh)
- **Vẽ khung mới**: Nhấn giữ chuột trái trên ảnh và kéo rê để tạo khung hình chữ nhật.
  - Khi đang kéo, màn hình sẽ hiển thị trực tiếp kích thước thực: `${icon} ${id}-${name} | W×H px`.
- **Đổi nhãn Tag ngay trên ảnh**:
  - Trên mỗi khung ảnh có một thanh nổi nhỏ gọn: `#1 [🏷️ defect-Lỗi hàn ▾] [✕]`.
  - Bạn có thể click vào dropdown để đổi Tag cho khung đó ngay lập tức mà không cần nhìn sang thanh menu bên phải.
- **Di chuyển khung**: Bấm giữ chuột vào vùng bên trong khung và kéo đến vị trí mong muốn.
- **Co giãn kích thước**: Rê chuột vào 4 góc tròn nhỏ của khung và kéo để phóng to/thu nhỏ chuẩn xác từng pixel.
- **Ghi chú & Ngày tháng**:
  - Chọn một khung $\rightarrow$ Nhìn sang danh sách thẻ bên phải (Sidebar) để điền **Ghi chú riêng** hoặc đổi **Ngày tháng**.

---

### Bước 4: Tự động vẽ lại khung từ file JSON (Auto Import)
Nếu bạn đã có sẵn tọa độ (do hệ thống khác xuất ra hoặc lưu từ phiên làm việc trước):
1. Bấm nút **"Mở tệp"** $\rightarrow$ chọn **"📥 Nhập dữ liệu JSON"** (hoặc kéo thả tệp `.json` vào trình duyệt).
2. Hệ thống sẽ **tự động vẽ lại toàn bộ các khung hình**, tự khôi phục danh mục Tag và ngày tháng chính xác 100%.

---

### Bước 5: Xuất dữ liệu đa định dạng (Export Hub)
Bấm vào nút **"Xuất dữ liệu ▾"** trên thanh Header:
1. **📊 Xuất Excel (`.xlsx`) & CSV (Database)**:
   - Mở cửa sổ **Tùy chọn Cột Dữ liệu** trực quan với **23 cột dữ liệu**.
   - Hỗ trợ các nút chọn nhanh 1-click:
     - `✨ Tất cả (23 cột)`: Xuất đầy đủ toàn bộ thông tin.
     - `📌 Cơ bản (8 cột)`: Chỉ gồm STT, Tên Tag, Ngày, Tọa độ XYWH, Ghi chú.
     - `📐 Tọa độ Pixel`: Phù hợp cho xử lý đồ họa, OpenCV.
     - `🤖 Chuẩn YOLO`: Phù hợp huấn luyện Deep Learning / AI.
     - `🗄️ Chuẩn Database`: Phù hợp nạp bảng SQL (PostgreSQL, MySQL, SQLite).
2. **📄 Tải tệp JSON**: Xuất file `.json` đầy đủ danh mục `categories` và mảng tọa độ `annotations`.
3. **🖼️ Tải ảnh kèm khung**: Tải về ảnh PNG đã vẽ sẵn các khung viền, nhãn Tag và mã ID phục vụ báo cáo.
4. **📋 Sao chép nhanh JSON**: Copy cấu trúc tọa độ vào Clipboard chỉ với 1 click.

---

### Bước 6: Chuyển đổi Giao diện & Ngôn ngữ
- **Đa ngôn ngữ**: Bấm vào nút ngôn ngữ trên Header để chuyển đổi tức thì giữa **🇻🇳 Tiếng Việt**, **🇬🇧 English**, và **🇨🇳 中文**.
- **Chế độ Sáng / Tối**: Bấm vào biểu tượng trăng/mặt trời để chọn:
  - ☀️ **Sáng (Light Mode)**
  - 🌙 **Tối (Dark Mode)**
  - 🖥️ **Hệ thống (System Mode - tự động đổi theo cài đặt Windows/macOS)**

---

## ⌨️ Phím Tắt Tiện Dụng (Keyboard Shortcuts)

| Phím tắt | Chức năng |
| :---: | :--- |
| **`1` đến `9`** | Gán nhanh Tag thứ 1 $\rightarrow$ 9 cho khung đang chọn (hoặc đặt Tag mặc định sắp vẽ) |
| **`Delete` / `Backspace`** | Xóa khung đang chọn |
| **`Ctrl + Z` / `Cmd + Z`** | Hoàn tác (Undo) khung vừa vẽ gần nhất |
| **Kéo chuột trái** | Vẽ khung chữ nhật mới trên ảnh |
| **Kéo góc tròn** | Co giãn chiều dài / chiều rộng của khung |

---

## 📊 Bảng Quy Chuẩn 23 Cột Dữ Liệu Excel / Database

Khi xuất file Excel hoặc CSV, dữ liệu được chuẩn hóa thành 23 trường:

| STT | Tên cột Excel / CSV | Kiểu dữ liệu | Ý nghĩa chi tiết |
| :---: | :--- | :--- | :--- |
| 1 | `ID` | String / BigInt | Mã định danh duy nhất của khung hình |
| 2 | `STT` | Integer | Số thứ tự của khung (1, 2, 3...) |
| 3 | `IMAGE_NAME` | String | Tên tệp tin hình ảnh gốc |
| 4 | `IMAGE_WIDTH` | Integer | Chiều rộng gốc của ảnh (pixels) |
| 5 | `IMAGE_HEIGHT` | Integer | Chiều cao gốc của ảnh (pixels) |
| 6 | `TAG_ID` | String | Mã định danh của Tag (VD: `person`, `defect_01`, `p01`) |
| 7 | `CLASS_ID` | Integer | Số thứ tự phân lớp theo chuẩn YOLO (0, 1, 2...) |
| 8 | `TAG_NAME` | String | Tên nhãn hiển thị (VD: `Người`, `Sản phẩm lỗi`) |
| 9 | `TAG_ICON` | String | Biểu tượng cảm xúc của Tag (Emoji) |
| 10 | `DATE_ISO` | Date (YYYY-MM-DD) | Ngày tháng theo chuẩn quốc tế ISO 8601 |
| 11 | `DATE_VN` | String (DD/MM/YYYY) | Ngày tháng theo chuẩn Việt Nam |
| 12 | `NOTE` | String | Ghi chú riêng cho khung hình |
| 13 | `X` | Integer | Tọa độ góc trên bên trái trục X (pixel) |
| 14 | `Y` | Integer | Tọa độ góc trên bên trái trục Y (pixel) |
| 15 | `WIDTH` | Integer | Chiều rộng khung hình (pixel) |
| 16 | `HEIGHT` | Integer | Chiều cao khung hình (pixel) |
| 17 | `X_MAX` | Integer | Tọa độ mép phải `(X + WIDTH)` (pixel) |
| 18 | `Y_MAX` | Integer | Tọa độ đáy dưới `(Y + HEIGHT)` (pixel) |
| 19 | `X_CENTER_NORM` | Float (0.0000 - 1.0000) | Tọa độ tâm X chuẩn hóa YOLO |
| 20 | `Y_CENTER_NORM` | Float (0.0000 - 1.0000) | Tọa độ tâm Y chuẩn hóa YOLO |
| 21 | `WIDTH_NORM` | Float (0.0000 - 1.0000) | Chiều rộng chuẩn hóa YOLO |
| 22 | `HEIGHT_NORM` | Float (0.0000 - 1.0000) | Chiều cao chuẩn hóa YOLO |
| 23 | `CREATED_AT` | Timestamp (ISO 8601) | Thời điểm xuất dữ liệu |

---

## 🤖 Công Thức Chuẩn Hóa Tọa Độ YOLO AI

$$\text{X\_CENTER\_NORM} = \frac{x + w / 2}{W_{\text{image}}}, \quad \text{Y\_CENTER\_NORM} = \frac{y + h / 2}{H_{\text{image}}}$$
$$\text{WIDTH\_NORM} = \frac{w}{W_{\text{image}}}, \quad \text{HEIGHT\_NORM} = \frac{h}{H_{\text{image}}}$$

*Tất cả giá trị nằm trong khoảng từ `0.000000` đến `1.000000`, sẵn sàng nạp trực tiếp vào tệp nhãn YOLO (`.txt`).*

---

## 🖼️ Tích Hợp Vào Trang Web Khác Qua IFrame (Widget)

Bạn có thể nhúng BBox Studio vào bất kỳ ứng dụng nào (React, Vue, Angular, Laravel, Django, WordPress...):

```html
<!-- Nhúng iframe -->
<iframe id="bboxFrame" src="https://laitran27.github.io/bbox-studio/" 
        width="100%" height="800px" style="border: none; border-radius: 12px;"></iframe>

<script>
  const bboxFrame = document.getElementById('bboxFrame');

  // Lắng nghe dữ liệu xuất ra từ BBox Studio
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'BBOX_STUDIO_EXPORT') {
      console.log('Tọa độ các khung:', event.data.data.annotations);
    }
  });

  // Ra lệnh yêu cầu BBox Studio trả về tọa độ
  function layToaDo() {
    bboxFrame.contentWindow.postMessage({ type: 'BBOX_STUDIO_GET_DATA' }, '*');
  }
</script>
```

👉 **Xem tài liệu chi tiết và code mẫu React/Vue:** [**`README_IFRAME.md`**](README_IFRAME.md)

---

## 🚀 Hướng Dẫn Tải Về & Chạy Cục Bộ (Local Setup)

```bash
# 1. Clone repository về máy
git clone https://github.com/laitran27/bbox-studio.git
cd bbox-studio

# 2. Khởi chạy
# Cách A: Trên Windows, chỉ cần click đúp vào file start.bat
# Cách B: Dùng Node.js
npm start

# Hoặc dùng bất kỳ máy chủ tĩnh nào (Python, Live Server...)
python -m http.server 3000
```
Mở trình duyệt tại: `http://localhost:3000`

---

## 🧪 Kiểm Thử Tự Động (Automated Testing)

Dự án có sẵn bộ test tự động kiểm tra toàn diện chức năng:
```bash
npm test
```

---

## 📄 Bản Quyền (License)

Dự án được phân phối theo giấy phép tự do nguồn mở **[MIT License](LICENSE)**. Bạn được toàn quyền tải về, chỉnh sửa và tích hợp vào các dự án thương mại hoàn toàn miễn phí.

<div align="center">
⭐ Nếu bạn thấy dự án hữu ích, hãy tặng một <b>Star</b> trên GitHub nhé! ⭐
</div>
