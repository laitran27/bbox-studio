// ==========================================
// HỆ THỐNG ĐA NGÔN NGỮ (i18n): TIẾNG VIỆT, TIẾNG ANH, TIẾNG TRUNG
// ==========================================

export const translations = {
    vi: {
        // Header
        app_title: "BBox Creative Studio",
        app_subtitle: "Gắn nhãn Tag trực tiếp trên từng khung hình & quản lý tọa độ",
        mode_light: "Sáng",
        mode_dark: "Tối",
        mode_system: "Hệ thống",
        mode_switcher_title: "Chế độ giao diện: Sáng / Tối / Hệ thống",
        toast_mode_light: "Đã chuyển sang giao diện Sáng (Light)",
        toast_mode_dark: "Đã chuyển sang giao diện Tối (Dark)",
        toast_mode_system: "Đã chuyển sang chế độ Hệ thống (System)",
        theme_sunset: "Sunset Pop",
        theme_tropical: "Tropical Fiesta",
        theme_berry: "Berry Studio",
        btn_upload_img: "Tải ảnh lên",
        menu_file: "Mở tệp",
        menu_export: "Xuất dữ liệu",
        btn_upload_img_desc: "JPG, PNG, WebP...",
        btn_import_json_desc: "Tự vẽ khung vào ảnh",
        btn_demo_img_desc: "Dùng thử ngay",
        export_excel_desc: "23 cột chuẩn để import DB",
        export_json_desc: "Tọa độ XYWH, XYXY, YOLO",
        export_img_desc: "Kèm Tag & Ngày trên ảnh",
        lang_switcher_title: "Ngôn ngữ / Language / 语言",
        theme_switcher_title: "Bảng màu giao diện",
        btn_import_json: "Nhập JSON",
        btn_demo_img: "Ảnh mẫu sinh động",
        btn_save_boxed_img: "Lưu ảnh có khung",
        title_save_boxed_img: "Tải xuống hình ảnh đã vẽ khung kèm Tag & Ngày",

        // Canvas Toolbar
        img_no_image: "Chưa có ảnh",
        cursor_label: "🎯 Con trỏ:",
        drawing_label: "📐 Đang kéo:",
        default_date_label: "📅 Ngày mặc định:",
        preset_today: "Hôm nay",
        preset_yesterday: "Hôm qua",
        preset_3days: "3 ngày trước",
        preset_week: "1 tuần trước",
        preset_tomorrow: "Ngày mai",
        preset_custom: "Tùy chỉnh...",
        preset_select_calendar: "Chọn lịch...",
        show_inline_combos: "Hiện nhãn Tag trên khung",
        show_inline_combos_title: "Hiển thị nhãn Tag và nút thao tác trực tiếp trên từng khung hình",
        btn_fit_mode_fit: "Vừa khung (Fit)",
        btn_fit_mode_original: "100% Gốc",
        toolbar_active_tag_label: "🏷️ Combo Tag vẽ mới:",
        btn_manage_tags: "Quản lý / Thêm Tag",
        btn_manage_tags_title: "Thêm Tag mới hoặc đổi tên/màu các Tag hiện có",

        // Empty Upload Screen
        empty_upload_title: "Tải lên hoặc Kéo thả hình ảnh vào đây",
        empty_upload_desc: "Mỗi khung hình bạn kéo trên ảnh sẽ có sẵn nhãn Tag trực tiếp và dễ dàng quản lý trên Sidebar!",
        empty_upload_btn: "✨ Chọn tệp ảnh từ máy tính",

        // Footer Shortcuts
        shortcut_inline_title: "Nhãn Tag trên khung",
        shortcut_inline_desc: "Đổi Tag trực tiếp trên từng khung ảnh",
        shortcut_drag_title: "Kéo viền / góc",
        shortcut_drag_desc: "Di chuyển hoặc co giãn khung trực tiếp",
        shortcut_keys_title: "Phím 1 - 9",
        shortcut_keys_desc: "Đổi nhanh Tag của khung đang chọn",
        footer_coord_desc: 'Tọa độ lưu theo <strong class="text-rose-600">pixel gốc</strong> kèm <strong class="text-orange-600">Tag & Ngày tháng</strong>',

        // Sidebar
        sidebar_title: "Danh Sách Tọa Độ & Đồng Bộ",
        btn_undo_title: "Hoàn tác khung vừa vẽ (Ctrl+Z)",
        btn_clear_all: "Xóa hết",
        tag_default_label: "Tag mặc định khi kéo khung:",
        coord_system_label: "Hệ tọa độ:",
        coord_format_xywh: "x, y, width, height (Pixel)",
        coord_format_xyxy: "xmin, ymin, xmax, ymax",
        coord_format_norm: "YOLO Chuẩn hóa (0-1)",
        filter_tag_label: "Lọc theo Tag:",
        filter_tag_all: "Tất cả các Tag",
        filter_date_label: "Lọc theo Ngày:",
        filter_date_clear_title: "Bỏ lọc ngày",
        empty_box_title: "Chưa có khung nào được đóng",
        empty_box_desc: "Hãy nhấn giữ chuột trái và kéo trên hình ảnh để đóng khung. Nhãn Tag sẽ gắn ngay trên khung vừa tạo!",
        data_export_title: "Dữ liệu & Xuất File (Database / JSON / Excel)",
        btn_zoom_json: "Phóng to JSON",
        btn_import_json_action: "📥 Nhập JSON",
        btn_import_json_tooltip: "Nhập file JSON đã có để tự động vẽ khung lên ảnh",
        btn_export_excel_action: "📊 Xuất Excel (DB)",
        btn_export_excel_tooltip: "Xuất file Excel (.xlsx) theo định dạng cột chuẩn để import vào Database",
        btn_copy_json_action: "Sao chép JSON",
        btn_download_json_action: "Tải file .JSON",

        // Card Labels
        box_num: "Khung #{num}",
        card_note_placeholder: "Ghi chú thêm cho khung này...",
        card_copy_btn_title: "Sao chép tọa độ khung này",
        card_delete_btn_title: "Xóa khung này",
        width_label: "W (Rộng)",
        height_label: "H (Cao)",

        // Modals
        json_modal_title: "Dữ liệu JSON Tọa Độ, Tag & Ngày Tháng",
        btn_import_from_json_file: "Nhập từ file JSON",
        btn_export_excel: "Xuất Excel (.xlsx)",
        btn_copy_all: "Sao chép toàn bộ",
        btn_close: "Đóng",
        tag_modal_title: "Quản Lý Danh Sách Tag (Choice) & Thêm Tag Mới",
        tag_modal_section1: "✨ Thêm Tag mới vào Combo Choice",
        tag_modal_icon: "Icon",
        tag_modal_icon_presets: "Chọn nhanh icon cơ bản:",
        tag_modal_id: "Mã Tag (ID)",
        tag_modal_id_ph: "VD: defect, P01, 01...",
        tag_modal_name: "Tên Tag mới",
        tag_modal_name_ph: "VD: Sản phẩm lỗi, Biển số...",
        tag_modal_color: "Màu khung",
        tag_modal_btn_add: "+ Thêm vào danh sách Choice & Chọn ngay",
        tag_modal_section2: "🎨 Chỉnh sửa các Tag trong Combo hiện tại",
        tag_modal_btn_done: "Hoàn tất",
        tag_modal_section_excel: "📥 Nhập & Xuất Danh Sách Tag Qua Excel / CSV (Kèm Template Mẫu)",
        tag_modal_desc_excel: "Quản lý Tag số lượng lớn bằng bảng tính Excel. Bạn có thể tải file template mẫu, điền các Tag rồi nạp lại vào hệ thống.",
        btn_download_tag_template: "📄 Tải Template Mẫu (.xlsx)",
        btn_import_tags_excel: "📊 Nhập Tag từ Excel / CSV",
        btn_export_tags_excel: "📤 Xuất Danh Sách Tag (.xlsx)",
        toast_tags_imported_excel: "Đã nạp thành công {count} Tag từ file \"{name}\"!",
        toast_tag_template_downloaded: "Đã tải xuống file template mẫu Tag (.xlsx) thành công!",
        toast_tags_exported_excel: "Đã xuất danh sách {count} Tag ra file Excel thành công!",
        toast_tags_empty_excel: "Không tìm thấy dữ liệu Tag hợp lệ trong file Excel!",
        toast_json_tags_imported: "Đã nạp thành công {count} nhãn Tag từ file JSON \"{name}\"!",
        tag_delete_btn_title: "Xóa Tag này",
        toast_keep_at_least_one_tag: "Cần giữ lại ít nhất 1 Tag trong danh sách!",
        tag_delete_confirm: "Xóa Tag \"{name}\"? Các khung đang dùng Tag này sẽ chuyển về Tag mặc định.",

        // Built-in Tag Names
        tag_person: "Người (Person)",
        tag_face: "Khuôn mặt (Face)",
        tag_vehicle: "Xe cộ (Vehicle)",
        tag_device: "Thiết bị / Điện tử",
        tag_object: "Đồ vật / Đồ uống",
        tag_animal: "Động vật (Animal)",
        tag_text: "Văn bản / Biển hiệu",
        tag_defect: "Điểm lỗi (Defect)",
        tag_other: "Khác (Other)",

        // Toasts
        toast_box_saved: "Đã lưu tọa độ khung!",
        toast_demo_loaded: "Đã nạp ảnh mẫu sinh động thành công!",
        toast_box_undone: "Đã hoàn tác khung vừa vẽ",
        toast_all_cleared: "Đã xóa toàn bộ các khung trên ảnh",
        toast_box_deleted: "Đã xóa khung thành công",
        toast_copied_all: "Đã sao chép toàn bộ {count} khung kèm Tag & Ngày vào Clipboard!",
        toast_copied_single: "Đã chép tọa độ, Tag \"{tag}\" & Ngày {date}!",
        toast_json_downloaded: "Đã tải xuống tệp JSON tọa độ thành công!",
        toast_excel_exported: "Đã xuất file Excel {count} dòng thành công!",
        toast_csv_exported: "Đã xuất file CSV Database {count} dòng thành công!",
        toast_img_downloaded: "Đã tải xuống hình ảnh kèm các khung đánh dấu & Ngày tháng!",
        toast_json_imported: "Đã nhập thành công {count} khung từ file \"{name}\"!",
        toast_tag_added: "Đã thêm Tag mới \"{name}\" thành công!",
        toast_tag_updated: "Đã cập nhật Tag thành công!",
        toast_tag_deleted: "Đã xóa Tag khỏi danh mục",
        toast_copy_fallback_error: "Không thể sao chép tự động, hãy bôi đen khung JSON!",
        toast_no_boxes_excel: "Chưa có khung nào để xuất file Excel!",
        toast_no_boxes_json: "Chưa có khung nào để tải JSON!",

        // Excel Column Modal
        excel_modal_title: "Tùy Chọn Cột Dữ Liệu Xuất Excel & Database",
        excel_modal_desc: "Tích chọn các cột bạn muốn xuất ra file bảng tính (.xlsx / .csv):",
        excel_preset_all: "✨ Tất cả (23 cột)",
        excel_preset_minimal: "📌 Cơ bản (8 cột)",
        excel_preset_pixel: "📐 Tọa độ Pixel",
        excel_preset_yolo: "🤖 Chuẩn YOLO",
        excel_preset_db: "🗄️ Chuẩn Database",
        excel_preset_none: "❌ Bỏ chọn hết",
        excel_selected_count: "Đã chọn: <strong class=\"text-emerald-600 dark:text-emerald-400\">{selected}</strong> / {total} cột",
        btn_export_xlsx_now: "Xuất Excel (.xlsx)",
        btn_export_csv_now: "Xuất CSV (.csv)",
        toast_no_columns_selected: "Vui lòng chọn ít nhất 1 cột để xuất!",
        toast_excel_exported_cols: "Đã xuất file Excel ({cols} cột, {count} dòng) thành công!",
        toast_csv_exported_cols: "Đã xuất file CSV ({cols} cột, {count} dòng) thành công!"
    },

    en: {
        // Header
        app_title: "BBox Creative Studio",
        app_subtitle: "Tag annotation directly on bounding boxes & coordinate management",
        mode_light: "Light",
        mode_dark: "Dark",
        mode_system: "System",
        mode_switcher_title: "Appearance: Light / Dark / System",
        toast_mode_light: "Switched to Light Mode",
        toast_mode_dark: "Switched to Dark Mode",
        toast_mode_system: "Switched to System Mode",
        theme_sunset: "Sunset Pop",
        theme_tropical: "Tropical Fiesta",
        theme_berry: "Berry Studio",
        btn_upload_img: "Upload Image",
        menu_file: "Open File",
        menu_export: "Export Data",
        btn_upload_img_desc: "JPG, PNG, WebP...",
        btn_import_json_desc: "Auto draw boxes on image",
        btn_demo_img_desc: "Try instantly",
        export_excel_desc: "23 standard DB columns",
        export_json_desc: "XYWH, XYXY, YOLO coordinates",
        export_img_desc: "With Tags & Dates on image",
        lang_switcher_title: "Language",
        theme_switcher_title: "Color Theme",
        btn_import_json: "Import JSON",
        btn_demo_img: "Demo Image",
        btn_save_boxed_img: "Save Boxed Image",
        title_save_boxed_img: "Download image with annotated bounding boxes, tags & dates",

        // Canvas Toolbar
        img_no_image: "No image",
        cursor_label: "🎯 Cursor:",
        drawing_label: "📐 Drawing:",
        default_date_label: "📅 Default Date:",
        preset_today: "Today",
        preset_yesterday: "Yesterday",
        preset_3days: "3 days ago",
        preset_week: "1 week ago",
        preset_tomorrow: "Tomorrow",
        preset_custom: "Custom...",
        preset_select_calendar: "Pick date...",
        show_inline_combos: "Show Tag on boxes",
        show_inline_combos_title: "Display Tag label and actions directly on each bounding box",
        btn_fit_mode_fit: "Fit Screen",
        btn_fit_mode_original: "100% Original",
        toolbar_active_tag_label: "🏷️ Active Drawing Tag:",
        btn_manage_tags: "Manage / Add Tags",
        btn_manage_tags_title: "Add new Tag or modify existing tag names and colors",

        // Empty Upload Screen
        empty_upload_title: "Upload or Drag & Drop Image Here",
        empty_upload_desc: "Every bounding box you draw comes with an inline Tag dropdown directly attached!",
        empty_upload_btn: "✨ Browse image from computer",

        // Footer Shortcuts
        shortcut_inline_title: "Tag on boxes",
        shortcut_inline_desc: "Change Tag directly on each box",
        shortcut_drag_title: "Drag border / handle",
        shortcut_drag_desc: "Move or resize boxes directly",
        shortcut_keys_title: "Keys 1 - 9",
        shortcut_keys_desc: "Quickly change tag of selected box",
        footer_coord_desc: 'Coordinates saved in <strong class="text-rose-600">native pixels</strong> with <strong class="text-orange-600">Tags & Dates</strong>',

        // Sidebar
        sidebar_title: "Coordinates & Sync List",
        btn_undo_title: "Undo last box (Ctrl+Z)",
        btn_clear_all: "Clear All",
        tag_default_label: "Default tag for new box:",
        coord_system_label: "Coordinate format:",
        coord_format_xywh: "x, y, width, height (Pixels)",
        coord_format_xyxy: "xmin, ymin, xmax, ymax",
        coord_format_norm: "YOLO Normalized (0-1)",
        filter_tag_label: "Filter by Tag:",
        filter_tag_all: "All Tags",
        filter_date_label: "Filter by Date:",
        filter_date_clear_title: "Clear date filter",
        empty_box_title: "No bounding boxes created yet",
        empty_box_desc: "Click and drag on the image to draw a box. The Tag label will appear right on the new box!",
        data_export_title: "Data & Export (Database / JSON / Excel)",
        btn_zoom_json: "Expand JSON",
        btn_import_json_action: "📥 Import JSON",
        btn_import_json_tooltip: "Import an existing JSON file to automatically draw boxes on the image",
        btn_export_excel_action: "📊 Export Excel (DB)",
        btn_export_excel_tooltip: "Export Excel (.xlsx) formatted with database columns for bulk ingestion",
        btn_copy_json_action: "Copy JSON",
        btn_download_json_action: "Download .JSON",

        // Card Labels
        box_num: "Box #{num}",
        card_note_placeholder: "Add note for this box...",
        card_copy_btn_title: "Copy coordinates of this box",
        card_delete_btn_title: "Delete this box",
        width_label: "W (Width)",
        height_label: "H (Height)",

        // Modals
        json_modal_title: "JSON Data: Coordinates, Tags & Dates",
        btn_import_from_json_file: "Import from JSON file",
        btn_export_excel: "Export Excel (.xlsx)",
        btn_copy_all: "Copy All",
        btn_close: "Close",
        tag_modal_title: "Manage Tag Choices & Add New Tag",
        tag_modal_section1: "✨ Add New Tag to Choice List",
        tag_modal_icon: "Icon",
        tag_modal_icon_presets: "Quick basic icons:",
        tag_modal_id: "Tag ID",
        tag_modal_id_ph: "E.g.: defect, P01, 01...",
        tag_modal_name: "New Tag Name",
        tag_modal_name_ph: "E.g.: Defective Item, License Plate...",
        tag_modal_color: "Box Color",
        tag_modal_btn_add: "+ Add to Choice list & Select now",
        tag_modal_section2: "🎨 Edit Existing Tags in Choice List",
        tag_modal_btn_done: "Done",
        tag_modal_section_excel: "📥 Import & Export Tag Catalog via Excel / CSV (With Template)",
        tag_modal_desc_excel: "Bulk manage your tags with Excel spreadsheet. You can download the template, fill in your tags, and import them anytime.",
        btn_download_tag_template: "📄 Download Template (.xlsx)",
        btn_import_tags_excel: "📊 Import Tags from Excel / CSV",
        btn_export_tags_excel: "📤 Export Tags to Excel (.xlsx)",
        toast_tags_imported_excel: "Successfully imported {count} Tags from \"{name}\"!",
        toast_tag_template_downloaded: "Downloaded Tag template Excel (.xlsx) successfully!",
        toast_tags_exported_excel: "Exported {count} Tags to Excel successfully!",
        toast_tags_empty_excel: "No valid Tag data found in Excel file!",
        toast_json_tags_imported: "Successfully imported {count} Tags from JSON \"{name}\"!",
        tag_delete_btn_title: "Delete this Tag",
        toast_keep_at_least_one_tag: "Must keep at least 1 Tag in the list!",
        tag_delete_confirm: "Delete Tag \"{name}\"? Boxes using this tag will switch to default tag.",

        // Built-in Tag Names
        tag_person: "Person",
        tag_face: "Face",
        tag_vehicle: "Vehicle",
        tag_device: "Device / Electronics",
        tag_object: "Object / Beverage",
        tag_animal: "Animal",
        tag_text: "Text / Sign",
        tag_defect: "Defect / Flaw",
        tag_other: "Other",

        // Toasts
        toast_box_saved: "Bounding box coordinates saved!",
        toast_demo_loaded: "Demo image loaded successfully!",
        toast_box_undone: "Undone last box",
        toast_all_cleared: "Cleared all boxes on image",
        toast_box_deleted: "Deleted box successfully",
        toast_copied_all: "Copied all {count} boxes with Tags & Dates to Clipboard!",
        toast_copied_single: "Copied coordinates, Tag \"{tag}\" & Date {date}!",
        toast_json_downloaded: "JSON coordinates file downloaded successfully!",
        toast_excel_exported: "Exported Excel file with {count} rows successfully!",
        toast_csv_exported: "Exported Database CSV file with {count} rows successfully!",
        toast_img_downloaded: "Downloaded annotated image with bounding boxes & dates!",
        toast_json_imported: "Successfully imported {count} boxes from \"{name}\"!",
        toast_tag_added: "New Tag \"{name}\" added successfully!",
        toast_tag_updated: "Tag updated successfully!",
        toast_tag_deleted: "Tag removed from list",
        toast_copy_fallback_error: "Automatic copy failed, please select and copy text manually!",
        toast_no_boxes_excel: "No boxes to export to Excel!",
        toast_no_boxes_json: "No boxes to download JSON!",

        // Excel Column Modal
        excel_modal_title: "Custom Excel & Database Export Columns",
        excel_modal_desc: "Select the specific columns you want to export to spreadsheet (.xlsx / .csv):",
        excel_preset_all: "✨ All (23 cols)",
        excel_preset_minimal: "📌 Essential (8 cols)",
        excel_preset_pixel: "📐 Pixel Coords",
        excel_preset_yolo: "🤖 YOLO AI",
        excel_preset_db: "🗄️ Database Format",
        excel_preset_none: "❌ Clear All",
        excel_selected_count: "Selected: <strong class=\"text-emerald-600 dark:text-emerald-400\">{selected}</strong> / {total} cols",
        btn_export_xlsx_now: "Export Excel (.xlsx)",
        btn_export_csv_now: "Export CSV (.csv)",
        toast_no_columns_selected: "Please select at least 1 column to export!",
        toast_excel_exported_cols: "Successfully exported Excel ({cols} cols, {count} rows)!",
        toast_csv_exported_cols: "Successfully exported CSV ({cols} cols, {count} rows)!"
    },

    zh: {
        // Header
        app_title: "BBox 创意标注工作台",
        app_subtitle: "直接在边界框上标注标签并管理坐标",
        mode_light: "浅色",
        mode_dark: "深色",
        mode_system: "跟随系统",
        mode_switcher_title: "界面外观：浅色 / 深色 / 跟随系统",
        toast_mode_light: "已切换至浅色模式",
        toast_mode_dark: "已切换至深色模式",
        toast_mode_system: "已切换至跟随系统模式",
        theme_sunset: "落日晚霞",
        theme_tropical: "热带狂欢",
        theme_berry: "浆果空间",
        btn_upload_img: "上传图片",
        menu_file: "打开文件",
        menu_export: "导出数据",
        btn_upload_img_desc: "JPG, PNG, WebP...",
        btn_import_json_desc: "自动在图上绘制标注框",
        btn_demo_img_desc: "立即体验",
        export_excel_desc: "23 列标准格式直接导入数据库",
        export_json_desc: "XYWH、XYXY、YOLO 格式",
        export_img_desc: "带有框、标签和日期",
        lang_switcher_title: "语言 / Language",
        theme_switcher_title: "主题配色",
        btn_import_json: "导入 JSON",
        btn_demo_img: "示例图片",
        btn_save_boxed_img: "保存标注图片",
        title_save_boxed_img: "下载带有标注框、标签和日期的图片",

        // Canvas Toolbar
        img_no_image: "暂无图片",
        cursor_label: "🎯 光标:",
        drawing_label: "📐 绘制中:",
        default_date_label: "📅 默认日期:",
        preset_today: "今天",
        preset_yesterday: "昨天",
        preset_3days: "3天前",
        preset_week: "1周前",
        preset_tomorrow: "明天",
        preset_custom: "自定义...",
        preset_select_calendar: "选择日历...",
        show_inline_combos: "在框上显示标签",
        show_inline_combos_title: "直接在标注框上显示标签名称及操作按钮",
        btn_fit_mode_fit: "适应窗口 (Fit)",
        btn_fit_mode_original: "100% 原始尺寸",
        toolbar_active_tag_label: "🏷️ 绘制默认标签:",
        btn_manage_tags: "管理 / 添加标签",
        btn_manage_tags_title: "添加新标签或修改现有标签名称与颜色",

        // Empty Upload Screen
        empty_upload_title: "上传或拖放图片到此处",
        empty_upload_desc: "您在图片上绘制的每个边界框，都会直接附带清晰的标签显示与快捷管理！",
        empty_upload_btn: "✨ 从电脑选择图片文件",

        // Footer Shortcuts
        shortcut_inline_title: "框上标签",
        shortcut_inline_desc: "直接在每个框上切换标签",
        shortcut_drag_title: "拖动边框 / 角点",
        shortcut_drag_desc: "直接移动或缩放边框大小",
        shortcut_keys_title: "数字键 1 - 9",
        shortcut_keys_desc: "快速切换当前选中框的标签",
        footer_coord_desc: '坐标以 <strong class="text-rose-600">原始像素</strong> 保存，附带 <strong class="text-orange-600">标签与日期</strong>',

        // Sidebar
        sidebar_title: "坐标列表与双向同步",
        btn_undo_title: "撤销刚绘制的框 (Ctrl+Z)",
        btn_clear_all: "清空全部",
        tag_default_label: "绘制新框时的默认标签:",
        coord_system_label: "坐标系格式:",
        coord_format_xywh: "x, y, 宽度, 高度 (像素)",
        coord_format_xyxy: "xmin, ymin, xmax, ymax",
        coord_format_norm: "YOLO 归一化比例 (0-1)",
        filter_tag_label: "按标签筛选:",
        filter_tag_all: "全部标签",
        filter_date_label: "按日期筛选:",
        filter_date_clear_title: "清除日期筛选",
        empty_box_title: "尚未创建任何标注框",
        empty_box_desc: "请按住鼠标左键并在图像上拖动以创建标注框。标签菜单将直接附加在新框上！",
        data_export_title: "数据与导出 (数据库 / JSON / Excel)",
        btn_zoom_json: "查看完整 JSON",
        btn_import_json_action: "📥 导入 JSON",
        btn_import_json_tooltip: "导入已有的 JSON 文件以自动在图像上绘制边框",
        btn_export_excel_action: "📊 导出 Excel (DB)",
        btn_export_excel_tooltip: "按数据库标准列规范导出 Excel (.xlsx) 文件，方便直接导入数据库",
        btn_copy_json_action: "复制 JSON",
        btn_download_json_action: "下载 .JSON",

        // Card Labels
        box_num: "标注框 #{num}",
        card_note_placeholder: "为此框添加备注说明...",
        card_copy_btn_title: "复制此框的坐标",
        card_delete_btn_title: "删除此框",
        width_label: "W (宽)",
        height_label: "H (高)",

        // Modals
        json_modal_title: "JSON 数据：坐标、标签与日期",
        btn_import_from_json_file: "从 JSON 文件导入",
        btn_export_excel: "导出 Excel (.xlsx)",
        btn_copy_all: "复制全部",
        btn_close: "关闭",
        tag_modal_title: "管理标签列表与添加新标签",
        tag_modal_section1: "✨ 添加新标签到选项列表",
        tag_modal_icon: "图标",
        tag_modal_icon_presets: "选择常用基础图标:",
        tag_modal_id: "标签 ID",
        tag_modal_id_ph: "例如：defect, P01, 01...",
        tag_modal_name: "新标签名称",
        tag_modal_name_ph: "例如：缺陷商品、车牌号...",
        tag_modal_color: "边框颜色",
        tag_modal_btn_add: "+ 添加到选择列表并立即选用",
        tag_modal_section2: "🎨 修改当前列表中的已有标签",
        tag_modal_btn_done: "完成",
        tag_modal_section_excel: "📥 通过 Excel / CSV 批量导入/导出标签（附带模板）",
        tag_modal_desc_excel: "使用 Excel 表格批量管理标签分类。您可以下载示例模板，填好标签后随时导入系统。",
        btn_download_tag_template: "📄 下载 Excel 模板 (.xlsx)",
        btn_import_tags_excel: "📊 从 Excel / CSV 导入标签",
        btn_export_tags_excel: "📤 导出标签列表 (.xlsx)",
        toast_tags_imported_excel: "已成功从 \"{name}\" 导入 {count} 个标签！",
        toast_tag_template_downloaded: "已成功下载标签模板 Excel (.xlsx)！",
        toast_tags_exported_excel: "已成功导出 {count} 个标签到 Excel！",
        toast_tags_empty_excel: "Excel 文件中未找到有效的标签数据！",
        toast_json_tags_imported: "已成功从 JSON \"{name}\" 导入 {count} 个标签！",
        tag_delete_btn_title: "删除此标签",
        toast_keep_at_least_one_tag: "列表中至少需要保留一个标签！",
        tag_delete_confirm: "确定删除标签 \"{name}\" 吗？正在使用此标签的框将切换为默认标签。",

        // Built-in Tag Names
        tag_person: "人员 (Person)",
        tag_face: "人脸 (Face)",
        tag_vehicle: "车辆 (Vehicle)",
        tag_device: "设备 / 电子",
        tag_object: "物品 / 饮料",
        tag_animal: "动物 (Animal)",
        tag_text: "文本 / 标牌",
        tag_defect: "缺陷 / 瑕疵",
        tag_other: "其他 (Other)",

        // Toasts
        toast_box_saved: "已保存标注框坐标！",
        toast_demo_loaded: "已成功加载生动示例图片！",
        toast_box_undone: "已撤销上一个绘制的标注框",
        toast_all_cleared: "已清除图片上的所有标注框",
        toast_box_deleted: "已成功删除标注框",
        toast_copied_all: "已将全部 {count} 个框及标签、日期复制到剪贴板！",
        toast_copied_single: "已复制坐标、标签 \"{tag}\" 与日期 {date}！",
        toast_json_downloaded: "已成功下载 JSON 坐标文件！",
        toast_excel_exported: "已成功导出包含 {count} 行数据的 Excel 文件！",
        toast_csv_exported: "已成功导出包含 {count} 行数据的数据库 CSV 文件！",
        toast_img_downloaded: "已下载带有标注框与日期的图片！",
        toast_json_imported: "已成功从文件 \"{name}\" 导入 {count} 个标注框！",
        toast_tag_added: "成功添加新标签 \"{name}\"！",
        toast_tag_updated: "标签更新成功！",
        toast_tag_deleted: "已从列表中移除该标签",
        toast_copy_fallback_error: "自动复制失败，请手动选中文本并复制！",
        toast_no_boxes_excel: "暂无标注框可导出为 Excel！",
        toast_no_boxes_json: "暂无标注框可下载 JSON！",

        // Excel Column Modal
        excel_modal_title: "自定义导出 Excel / 数据库数据列",
        excel_modal_desc: "勾选您需要导出到表格文件 (.xlsx / .csv) 中的数据字段：",
        excel_preset_all: "✨ 全选 (23 列)",
        excel_preset_minimal: "📌 基础字段 (8 列)",
        excel_preset_pixel: "📐 像素坐标",
        excel_preset_yolo: "🤖 YOLO AI 格式",
        excel_preset_db: "🗄️ 数据库格式",
        excel_preset_none: "❌ 清空选择",
        excel_selected_count: "已选：<strong class=\"text-emerald-600 dark:text-emerald-400\">{selected}</strong> / {total} 列",
        btn_export_xlsx_now: "导出 Excel (.xlsx)",
        btn_export_csv_now: "导出 CSV (.csv)",
        toast_no_columns_selected: "请至少选择 1 列进行导出！",
        toast_excel_exported_cols: "成功导出 Excel ({cols} 列，{count} 行)！",
        toast_csv_exported_cols: "成功导出 CSV ({cols} 列，{count} 行)！"
    }
};

const STORAGE_LANG_KEY = 'bbox_studio_language';
let currentLang = 'vi';

/**
 * Khởi tạo ngôn ngữ ban đầu từ LocalStorage hoặc mặc định là 'vi'
 */
export function initLanguage() {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved && (saved === 'vi' || saved === 'en' || saved === 'zh')) {
        currentLang = saved;
    } else {
        // Tự động nhận diện ngôn ngữ trình duyệt nếu có
        const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (navLang.startsWith('zh')) {
            currentLang = 'zh';
        } else if (navLang.startsWith('en')) {
            currentLang = 'en';
        } else {
            currentLang = 'vi';
        }
    }
    return currentLang;
}

/**
 * Lấy mã ngôn ngữ hiện tại ('vi' | 'en' | 'zh')
 */
export function getCurrentLanguage() {
    return currentLang;
}

/**
 * Lấy chuỗi bản dịch theo key, hỗ trợ truyền tham số nội suy {param}
 * @param {string} key - Tên key trong từ điển
 * @param {object} [params] - Các tham số thay thế {count, name, ...}
 * @returns {string} Chuỗi đã dịch
 */
export function t(key, params = {}) {
    const dict = translations[currentLang] || translations.vi;
    let text = dict[key] || translations.vi[key] || key;
    
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(p => {
            text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
        });
    }
    return text;
}

/**
 * Cập nhật ngôn ngữ và làm mới toàn bộ giao diện
 * @param {'vi'|'en'|'zh'} lang - Mã ngôn ngữ mới
 * @param {Function} [onUpdateCallback] - Hàm gọi lại sau khi đổi ngôn ngữ để đồng bộ View
 */
export function setLanguage(lang, onUpdateCallback = null) {
    if (!['vi', 'en', 'zh'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_LANG_KEY, lang);
    document.documentElement.lang = lang;

    // Cập nhật trạng thái các nút chuyển ngôn ngữ trên header
    updateLangSwitcherUI();

    // Cập nhật tất cả các phần tử có thuộc tính data-i18n
    applyTranslationsToDOM();

    // Callback nếu có để đồng bộ view
    if (typeof onUpdateCallback === 'function') {
        onUpdateCallback(lang);
    }
}

/**
 * Cập nhật giao diện nút đổi ngôn ngữ
 */
export function updateLangSwitcherUI() {
    const langSelect = document.getElementById('langSelectCombo');
    if (langSelect && langSelect.value !== currentLang) {
        langSelect.value = currentLang;
    }
    ['vi', 'en', 'zh'].forEach(l => {
        const btn = document.getElementById(`langBtn-${l}`);
        if (!btn) return;
        if (l === currentLang) {
            btn.className = "px-2.5 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm cursor-pointer";
        } else {
            btn.className = "px-2.5 py-1 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-white/80 dark:hover:bg-stone-700/80 transition flex items-center gap-1.5 cursor-pointer";
        }
    });
}

/**
 * Quét toàn bộ DOM và áp dụng bản dịch cho các thẻ có data-i18n, data-i18n-title, data-i18n-placeholder
 */
export function applyTranslationsToDOM() {
    // 1. Dịch text / html
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
            const translated = t(key);
            if (translated.includes('<strong') || translated.includes('<span')) {
                el.innerHTML = translated;
            } else {
                el.textContent = translated;
            }
        }
    });

    // 2. Dịch thuộc tính title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) el.title = t(key);
    });

    // 3. Dịch thuộc tính placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = t(key);
    });
}

/**
 * Định dạng ngày theo ngôn ngữ đang chọn
 * @param {string} isoDate - YYYY-MM-DD
 * @returns {string} Chuỗi ngày đã định dạng
 */
export function formatDate(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    const [yyyy, mm, dd] = parts;

    if (currentLang === 'vi') {
        return `${dd}/${mm}/${yyyy}`;
    } else if (currentLang === 'en') {
        return `${yyyy}-${mm}-${dd}`;
    } else if (currentLang === 'zh') {
        return `${yyyy}/${mm}/${dd}`;
    }
    return `${dd}/${mm}/${yyyy}`;
}
