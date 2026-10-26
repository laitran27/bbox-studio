<div align="center">

# 🎨 BBox Studio
### ⚡ Lightweight, Zero-Dependency Web Image Annotation & Bounding Box Tool
**Annotate bounding boxes, manage custom Tag IDs with colors & icons, assign inspection dates, and export to YOLO / Excel / CSV / JSON.**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Pure%20JS)-orange.svg)](#)
[![Multi-Language](https://img.shields.io/badge/Language-EN%20%7C%20VI%20%7C%20ZH-rose.svg)](#)
[![Theme](https://img.shields.io/badge/Theme-Light%20%7C%20Dark%20%7C%20System-purple.svg)](#)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue.svg)](https://laitran27.github.io/bbox-studio/)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](#)

[**🚀 Live Demo**](https://laitran27.github.io/bbox-studio/) • [**📖 User Guide**](#-step-by-step-user-guide) • [**📘 IFrame Integration**](README_IFRAME.md) • [**📊 Excel & YOLO Specs**](#-23-column-database--excel-schema-reference) • [**🇻🇳 Bản Tiếng Việt**](README.vi.md)

</div>

---

## 🌟 Overview

**BBox Studio** is a client-side web application for **image bounding box annotation**, built with pure HTML5 Canvas and vanilla JavaScript. It requires **no backend server, no npm installations, and zero runtime dependencies**—open it in any modern browser and start labeling immediately.

### Ideal For:
- 🤖 **Computer Vision & AI Engineers**: Label datasets for YOLO, object detection, and feature extraction with normalized 0.0–1.0 coordinates.
- 🏭 **QA / QC & Defect Inspection Teams**: Tag defects, barcodes, license plates, and parts with explicit Tag IDs, colors, dates, and notes.
- 💻 **Web Developers & SaaS Platforms**: Embed BBox Studio as a ready-to-use labeling widget into existing web apps (React, Vue, Angular, Laravel, Django, WordPress) using an `<iframe>` and a two-way `window.postMessage` API.

---

## ✨ Key Features

- 🎯 **Fast & Fluid Canvas Annotation**: Click and drag to create boxes, drag to reposition, and use 4 corner handles to resize precisely to the exact pixel.
- 🏷️ **Comprehensive Tag Management with Tag IDs**:
  - Assign explicit **Tag ID** (`tag.id`), **Display Name** (`tag.name`), **Color** (`tag.color`), and **Emoji Icon** (`tag.icon`).
  - Rendered across all views in the clean format: **`ID-Tag Name`** (e.g., `DEFECT_01-Solder Crack`, `person-Person`).
  - **Bulk Tag Import/Export via Excel**: Download a structured Excel template (`.xlsx`), fill in dozens of labels, and import them with 1 click.
  - **Category Preservation in JSON**: Exported JSON files preserve the `categories: [...]` catalog and automatically restore custom tags upon re-import.
- 📥 **Auto-Import & Restore from JSON**: Drag and drop any previously saved JSON file to instantly redraw all bounding boxes, tags, notes, and dates on the image.
- 📊 **Customizable Excel (`.xlsx`) & CSV Export**:
  - Choose from **23 standardized database columns** (Identifiers, Tag metadata, Vietnamese & ISO dates, Pixel coordinates XYWH/XYXY, YOLO normalized 0–1, image dimensions).
  - 6 instant 1-click presets: *All (23 cols), Essential (8 cols), Pixel Coordinates, YOLO AI, Database Format, and Clear All*.
- 🖼️ **Two-Way IFrame Widget Integration**: Embed seamlessly into parent web applications with full bidirectional communication.
- 🌐 **Internationalization (i18n)**: 1-click switching between **English 🇬🇧**, **Vietnamese 🇻🇳**, and **Chinese 🇨🇳**.
- 🌓 **Adaptive Theming**: Fully supports **Light Mode**, **Dark Mode**, and **System Mode** (automatically respects OS `prefers-color-scheme`).

---

## 📖 Step-by-Step User Guide

### Step 1: Load an Image
You can load images in 3 different ways:
1. **Upload from Device**: Click the **"Upload Image"** button on the top header to select any image (`.jpg`, `.png`, `.webp`, `.bmp`).
2. **Drag & Drop**: Drag an image file from your computer file explorer directly onto the canvas area.
3. **1-Click Demo Sample**: Click the arrow next to the Upload button $\rightarrow$ Select **"Load Demo Sample Image"** to explore all features instantly with sample boxes.

---

### Step 2: Configure & Manage Tags (Categories)
Every box can be classified with an explicit Tag formatted as **`ID-Tag Name`**:
- **Select Active Tag**: Click any quick-select chip on the toolbar or press keys `1` through `9`.
- **Add a New Tag**:
  1. Click **"⚙️ Manage Tags"**.
  2. Enter:
     - **Icon**: Choose an emoji or pick from the 35 basic icon palette.
     - **Tag ID**: Enter a unique slug (e.g., `DEFECT_01`, `P01`, `license_plate`).
     - **Tag Name**: Enter the human-readable label (e.g., `Solder Crack`, `Supervisor`).
     - **Box Color**: Select a distinctive hex color.
  3. Click **"+ Add to Choice list & Select now"**.
- **Edit Existing Tags**:
  - In the Tag Management modal, edit the ID, name, icon, or color of any existing tag. All boxes currently drawn with that tag will **automatically update in real-time**.
- **Bulk Excel Import/Export**:
  - Click **"📄 Download Template (.xlsx)"** to get a ready-made spreadsheet template.
  - Click **"📊 Import Tags from Excel / CSV"** to load dozens or hundreds of categories instantly.
  - Click **"📤 Export Tags"** to backup your current category catalog.

---

### Step 3: Draw & Annotate Bounding Boxes
- **Draw a New Box**: Click and drag your left mouse button over the target object on the canvas.
  - The live drag preview displays: `${icon} ${id}-${name} | W×H px`.
- **Inline Box Toolbar on Image**:
  - Each bounding box features a clutter-free inline header: `#1 [🏷️ defect-Scratch ▾] [✕]`.
  - Change the tag directly from the inline dropdown without needing to look at the sidebar.
- **Move & Reposition**: Click inside any box and drag it to a new location.
- **Resize Accurately**: Hover over any of the 4 corner circular handles and drag to adjust width and height pixel-by-pixel.
- **Add Inspection Dates & Notes**:
  - Click any box card in the right **Sidebar** to type a custom note or assign an inspection date.

---

### Step 4: Auto-Import Coordinates from JSON
If you have previously exported annotations or have model predictions:
1. Click **"Open File"** $\rightarrow$ select **"📥 Import JSON Data"** (or drag & drop a `.json` file onto the browser).
2. The application will **automatically redraw all bounding boxes**, restore custom tags, and map coordinates with 100% precision.

---

### Step 5: Multi-Format Data Export (Export Hub)
Click the **"Export Data ▾"** button on the header:
1. **📊 Export Excel (`.xlsx`) & CSV (Database)**:
   - Opens the **Custom Column Selection Modal** featuring **23 selectable fields**.
   - Use instant presets:
     - `✨ All (23 cols)`: Full export with all available metrics.
     - `📌 Essential (8 cols)`: Clean summary with Index, Tag, Date, XYWH coordinates, and Note.
     - `📐 Pixel Coords`: Tailored for computer vision and OpenCV graphics.
     - `🤖 YOLO Format`: Tailored for AI/Deep Learning model training.
     - `🗄️ Database Format`: Clean relational schema for PostgreSQL, MySQL, and SQLite.
2. **📄 Download JSON**: Exports the full JSON structure including `categories: [...]` and `annotations: [...]`.
3. **🖼️ Download Annotated Image**: Exports a high-resolution PNG image with all bounding boxes and `#1 [ID-Name]` badges rendered directly onto the canvas.
4. **📋 Copy JSON to Clipboard**: Copies the full JSON data in one click for quick pasting.

---

### Step 6: Customize Language & Theme
- **Multi-Language**: Click the language switcher in the header to instantly translate the UI into **English 🇬🇧**, **Vietnamese 🇻🇳**, or **Chinese 🇨🇳**.
- **Light / Dark / System Mode**: Click the theme toggle button to choose between:
  - ☀️ **Light Mode**
  - 🌙 **Dark Mode**
  - 🖥️ **System Mode** (automatically synchronizes with your OS dark/light mode preference)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :---: | :--- |
| **`1` – `9`** | Quickly assign the 1st through 9th Tag to the selected box (or set default tag for the next box) |
| **`Delete` / `Backspace`** | Delete the currently selected bounding box |
| **`Ctrl + Z` / `Cmd + Z`** | Undo the most recently drawn bounding box |
| **Left Click + Drag** | Draw a new rectangular bounding box on the image |
| **Corner Drag** | Resize the bounding box from any of its 4 corner handles |

---

## 📊 23-Column Database & Excel Schema Reference

When exporting to Excel (`.xlsx`) or CSV, data is structured into 23 standardized fields:

| # | Column Name | Data Type | Description |
| :---: | :--- | :--- | :--- |
| 1 | `ID` | String / BigInt | Unique timestamp identifier for the box |
| 2 | `STT` | Integer | Sequence index (1, 2, 3...) |
| 3 | `IMAGE_NAME` | String | Source image file name |
| 4 | `IMAGE_WIDTH` | Integer | Original image width in pixels |
| 5 | `IMAGE_HEIGHT` | Integer | Original image height in pixels |
| 6 | `TAG_ID` | String | Unique slug ID of the tag (e.g., `person`, `defect_01`, `p01`) |
| 7 | `CLASS_ID` | Integer | Zero-indexed class number for YOLO training (0, 1, 2...) |
| 8 | `TAG_NAME` | String | Display name of the tag (e.g., `Person`, `Defective Item`) |
| 9 | `TAG_ICON` | String | Emoji icon assigned to the tag |
| 10 | `DATE_ISO` | Date (YYYY-MM-DD) | Standard ISO 8601 date format |
| 11 | `DATE_VN` | String (DD/MM/YYYY) | Vietnamese localized date format |
| 12 | `NOTE` | String | Custom note attached to the bounding box |
| 13 | `X` | Integer | Top-left corner X coordinate (pixels) |
| 14 | `Y` | Integer | Top-left corner Y coordinate (pixels) |
| 15 | `WIDTH` | Integer | Box width (pixels) |
| 16 | `HEIGHT` | Integer | Box height (pixels) |
| 17 | `X_MAX` | Integer | Right edge coordinate `(X + WIDTH)` (pixels) |
| 18 | `Y_MAX` | Integer | Bottom edge coordinate `(Y + HEIGHT)` (pixels) |
| 19 | `X_CENTER_NORM` | Float (0.0000 - 1.0000) | Normalized center X coordinate (YOLO format) |
| 20 | `Y_CENTER_NORM` | Float (0.0000 - 1.0000) | Normalized center Y coordinate (YOLO format) |
| 21 | `WIDTH_NORM` | Float (0.0000 - 1.0000) | Normalized width (YOLO format) |
| 22 | `HEIGHT_NORM` | Float (0.0000 - 1.0000) | Normalized height (YOLO format) |
| 23 | `CREATED_AT` | Timestamp (ISO 8601) | Record export timestamp |

---

## 🤖 YOLO AI Coordinate Normalization Formula

$$\text{X\_CENTER\_NORM} = \frac{x + w / 2}{W_{\text{image}}}, \quad \text{Y\_CENTER\_NORM} = \frac{y + h / 2}{H_{\text{image}}}$$
$$\text{WIDTH\_NORM} = \frac{w}{W_{\text{image}}}, \quad \text{HEIGHT\_NORM} = \frac{h}{H_{\text{image}}}$$

*All normalized values range from `0.000000` to `1.000000`, matching the standard YOLO `.txt` annotation format:*
```text
<class_id> <x_center_norm> <y_center_norm> <width_norm> <height_norm>
```

---

## 🖼️ IFrame Widget Integration

Embed **BBox Studio** into any web application (React, Vue, Angular, Laravel, Django, WordPress, Vanilla JS):

```html
<!-- Embed the widget -->
<iframe id="bboxFrame" src="https://laitran27.github.io/bbox-studio/" 
        width="100%" height="800px" style="border: none; border-radius: 12px;"></iframe>

<script>
  const bboxFrame = document.getElementById('bboxFrame');

  // Listen for exported data from BBox Studio
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'BBOX_STUDIO_EXPORT') {
      console.log('Received bounding boxes:', event.data.data.annotations);
    }
  });

  // Request bounding box coordinates from parent
  function getCoordinates() {
    bboxFrame.contentWindow.postMessage({ type: 'BBOX_STUDIO_GET_DATA' }, '*');
  }

  // Load an image into the iframe programmatically
  function loadImage(imageUrl) {
    bboxFrame.contentWindow.postMessage({ 
      type: 'BBOX_STUDIO_LOAD_IMAGE', 
      imageUrl: imageUrl 
    }, '*');
  }
</script>
```

👉 **Full IFrame Documentation with React 18+ & Vue 3 Code Samples:** [**`README_IFRAME.md`**](README_IFRAME.md)

---

## 🚀 Local Setup & Quick Start

Because the project is 100% client-side, setup takes less than 30 seconds:

```bash
# 1. Clone the repository
git clone https://github.com/laitran27/bbox-studio.git
cd bbox-studio

# 2. Launch the application
# Option A: On Windows, double-click start.bat
# Option B: Using Node.js
npm start

# Option C: Using Python
python -m http.server 3000
```
Open your browser at: `http://localhost:3000`

---

## 🧪 Automated Testing

The project includes an automated end-to-end CDP test suite (running in headless Microsoft Edge / Chromium):

```bash
npm test
```
*Verifies: Multi-language switching, Dark/Light mode, Canvas drawing, JSON auto-import, Excel 23-column export, Tag ID management, and IFrame bidirectional postMessage communication.*

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are warmly welcome!
1. Fork the Project: `git fork https://github.com/laitran27/bbox-studio`
2. Create your Feature Branch: `git checkout -b feature/AmazingFeature`
3. Commit your Changes: `git commit -m "feat: add AmazingFeature"`
4. Push to the Branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **[MIT License](LICENSE)**. You are free to use, modify, and distribute this software for personal or commercial projects.

<div align="center">
⭐ If you find this tool helpful, please give it a <b>Star</b> on GitHub! ⭐
</div>
