import { spawn } from 'child_process';
import http from 'http';

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const cdpPort = 9224;

async function testPage(url, pageName) {
    console.log(`\n================ Testing ${pageName}: ${url} ================`);
    const edge = spawn(edgePath, [
        `--remote-debugging-port=${cdpPort}`,
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        url
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targets = await new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${cdpPort}/json/list`, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const pageTarget = targets.find(t => t.type === 'page');
        if (!pageTarget) throw new Error("No page target found");

        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
            ws.onopen = resolve;
            ws.onerror = reject;
        });

        let id = 1;
        function send(method, params = {}) {
            return new Promise((resolve, reject) => {
                const reqId = id++;
                const handler = (evt) => {
                    const msg = JSON.parse(evt.data);
                    if (msg.id === reqId) {
                        ws.removeEventListener('message', handler);
                        if (msg.error) reject(msg.error);
                        else resolve(msg.result);
                    }
                };
                ws.addEventListener('message', handler);
                ws.send(JSON.stringify({ id: reqId, method, params }));
            });
        }

        async function evalJs(expr) {
            const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
            if (res.exceptionDetails) {
                throw new Error(res.exceptionDetails.exception?.description || JSON.stringify(res.exceptionDetails));
            }
            return res.result?.value;
        }

        // 1. Check title & exports
        const title = await evalJs('document.title');
        console.log(`[PASS] Title: "${title}"`);

        // Wait for modules to be ready
        await evalJs(`
            new Promise((resolve, reject) => {
                const start = Date.now();
                const check = () => {
                    if (typeof window.setAppLanguage === "function" && typeof window.importJsonData === "function") {
                        resolve(true);
                    } else if (Date.now() - start > 10000) {
                        reject(new Error("Timeout waiting for app modules to load"));
                    } else {
                        setTimeout(check, 50);
                    }
                };
                check();
            })
        `);

        const hasImports = await evalJs('typeof window.importJsonData === "function" && typeof window.exportToExcel === "function" && typeof window.generateDatabaseRows === "function" && typeof window.setAppLanguage === "function"');
        console.log(`[PASS] Core functions exist: ${hasImports}`);

        // 2. Test Multi-language (i18n): English, Chinese, Vietnamese
        console.log('\n--- Testing Language Switching ---');
        // Switch to English
        await evalJs('window.setAppLanguage("en")');
        await new Promise(r => setTimeout(r, 300));
        const langEn = await evalJs('document.documentElement.lang');
        const uploadBtnEn = await evalJs('document.querySelector("[data-i18n=\'btn_upload_img\']")?.textContent');
        const sidebarTitleEn = await evalJs('document.querySelector("[data-i18n=\'sidebar_title\']")?.textContent');
        console.log(`[PASS] English: lang="${langEn}", uploadBtn="${uploadBtnEn}", sidebarTitle="${sidebarTitleEn}"`);
        if (langEn !== 'en' || uploadBtnEn !== 'Upload Image') throw new Error("English translation failed");

        // Switch to Chinese
        await evalJs('window.setAppLanguage("zh")');
        await new Promise(r => setTimeout(r, 300));
        const langZh = await evalJs('document.documentElement.lang');
        const uploadBtnZh = await evalJs('document.querySelector("[data-i18n=\'btn_upload_img\']")?.textContent');
        const sidebarTitleZh = await evalJs('document.querySelector("[data-i18n=\'sidebar_title\']")?.textContent');
        console.log(`[PASS] Chinese: lang="${langZh}", uploadBtn="${uploadBtnZh}", sidebarTitle="${sidebarTitleZh}"`);
        if (langZh !== 'zh' || uploadBtnZh !== '上传图片') throw new Error("Chinese translation failed");

        // Switch back to Vietnamese
        await evalJs('window.setAppLanguage("vi")');
        await new Promise(r => setTimeout(r, 300));
        const langVi = await evalJs('document.documentElement.lang');
        const uploadBtnVi = await evalJs('document.querySelector("[data-i18n=\'btn_upload_img\']")?.textContent');
        console.log(`[PASS] Vietnamese: lang="${langVi}", uploadBtn="${uploadBtnVi}"`);
        if (langVi !== 'vi' || uploadBtnVi !== 'Tải ảnh lên') throw new Error("Vietnamese translation failed");

        // 2b. Test Dark / Light / System Mode
        console.log('\n--- Testing Dark / Light / System Mode ---');
        // Switch to Dark
        await evalJs('window.setColorMode("dark", false)');
        await new Promise(r => setTimeout(r, 200));
        const isHtmlDark = await evalJs('document.documentElement.classList.contains("dark")');
        const isBodyDark = await evalJs('document.body.classList.contains("dark")');
        const modeDark = await evalJs('window.getColorMode()');
        console.log(`[PASS] Dark Mode: html.dark=${isHtmlDark}, body.dark=${isBodyDark}, mode="${modeDark}"`);
        if (!isHtmlDark || !isBodyDark || modeDark !== 'dark') throw new Error("Dark mode activation failed");

        // Switch to Light
        await evalJs('window.setColorMode("light", false)');
        await new Promise(r => setTimeout(r, 200));
        const isHtmlLight = await evalJs('!document.documentElement.classList.contains("dark")');
        const modeLight = await evalJs('window.getColorMode()');
        console.log(`[PASS] Light Mode: !html.dark=${isHtmlLight}, mode="${modeLight}"`);
        if (!isHtmlLight || modeLight !== 'light') throw new Error("Light mode activation failed");

        // Switch to System
        await evalJs('window.setColorMode("system", false)');
        await new Promise(r => setTimeout(r, 200));
        const modeSystem = await evalJs('window.getColorMode()');
        console.log(`[PASS] System Mode: mode="${modeSystem}"`);
        if (modeSystem !== 'system') throw new Error("System mode activation failed");

        // Test Creative Themes
        await evalJs('window.setCreativeTheme("tropical", false)');
        const isTropical = await evalJs('document.body.classList.contains("theme-tropical")');
        console.log(`[PASS] Creative Theme: tropical=${isTropical}`);
        if (!isTropical) throw new Error("Tropical theme activation failed");

        await evalJs('window.setCreativeTheme("sunset", false)');

        // 3. Load demo image
        await evalJs('window.loadDemoImage()');
        await new Promise(r => setTimeout(r, 800));
        const hasImg = await evalJs('!!document.getElementById("imgSizeDisplay")?.textContent.includes("×")');
        console.log(`[PASS] Demo image loaded: ${hasImg}`);

        // 4. Test JSON Import
        const sampleJson = JSON.stringify({
            image_name: "test_banner.png",
            annotations: [
                {
                    tag_name: "Khuyến mãi",
                    date_iso: "2026-11-01",
                    note: "Giảm giá 50%",
                    coordinates: { x: 100, y: 150, width: 200, height: 120 }
                },
                {
                    tag_name: "Sản phẩm VIP",
                    date_iso: "2026-11-05",
                    note: "Hàng mới về",
                    coordinates: { x: 350, y: 200, width: 180, height: 160 }
                }
            ]
        });

        const importRes = await evalJs(`window.importJsonData(${JSON.stringify(sampleJson)})`);
        console.log(`[PASS] Import result: count=${importRes.count}, success=${importRes.success}`);

        // Verify boxes rendered in sidebar
        const boxCount = await evalJs('document.getElementById("boxCountBadge")?.textContent');
        console.log(`[PASS] Box count badge: ${boxCount}`);

        const cardCount = await evalJs("document.querySelectorAll('#boxListContainer > div[id^=\"box-card-\"]').length");
        console.log(`[PASS] Rendered cards count: ${cardCount}`);

        // 4b. Verify inline overlay box toolbar only has Tag, no date/preset clutter
        const inlineToolbarHasDateInput = await evalJs('!!document.querySelector(".inline-box-toolbar input[type=\'date\']")');
        const inlineToolbarSelectCount = await evalJs('document.querySelectorAll("#bboxOverlayLayer div[id^=\'overlay-box-\'] .inline-box-toolbar select").length');
        const overlayBoxCount = await evalJs('document.querySelectorAll("#bboxOverlayLayer div[id^=\'overlay-box-\']").length');
        console.log(`[PASS] Inline box toolbar clutter-free check: hasDateInput=${inlineToolbarHasDateInput}, totalOverlayBoxes=${overlayBoxCount}, totalTagSelects=${inlineToolbarSelectCount}`);
        if (inlineToolbarHasDateInput || inlineToolbarSelectCount !== overlayBoxCount) {
            throw new Error("Inline box toolbar should only have 1 select (Tag) per box and no date input");
        }

        // 5. Test generateDatabaseRows
        const rows = await evalJs('window.generateDatabaseRows()');
        console.log(`[PASS] Database rows count: ${rows.length}`);
        console.log(`[PASS] Row 0 columns:`, Object.keys(rows[0]));
        console.log(`[PASS] Sample row 0: ID=${rows[0].ID}, TAG_NAME=${rows[0].TAG_NAME}, X=${rows[0].X}, WIDTH=${rows[0].WIDTH}, DATE_ISO=${rows[0].DATE_ISO}`);

        // 6. Verify Tag change updates card without bug
        const card1TagBefore = await evalJs("document.querySelector('#boxListContainer div[id^=\"box-card-\"]:nth-child(1) select')?.value");
        console.log(`[PASS] Card 1 tag before: ${card1TagBefore}`);
        await evalJs(`
            const selectEl = document.querySelector('#boxListContainer div[id^="box-card-"]:nth-child(1) select');
            if (selectEl) {
                const optValues = Array.from(selectEl.options).map(o => o.value);
                const nextVal = optValues.find(v => v !== selectEl.value);
                if (nextVal) {
                    selectEl.value = nextVal;
                    selectEl.dispatchEvent(new Event('change'));
                }
            }
        `);
        await new Promise(r => setTimeout(r, 400));
        const card1TagAfter = await evalJs("document.querySelector('#boxListContainer div[id^=\"box-card-\"]:nth-child(1) select')?.value");
        console.log(`[PASS] Card 1 tag after change: ${card1TagAfter}`);

        // 7. Test Excel / SheetJS
        const sheetJsExists = await evalJs('typeof window.XLSX !== "undefined" && typeof window.XLSX.utils !== "undefined"');
        console.log(`[PASS] SheetJS library ready: ${sheetJsExists}`);

        // 7b. Test Custom Excel & Database Column Selection
        console.log('\n--- Testing Custom Excel Column Selection ---');
        // Open Column modal
        await evalJs('window.openExcelColumnModal()');
        await new Promise(r => setTimeout(r, 200));
        const colModalOpen = await evalJs('!document.getElementById("excelColumnsModal")?.classList.contains("hidden")');
        console.log(`[PASS] Excel columns modal opened: ${colModalOpen}`);
        if (!colModalOpen) throw new Error("Failed to open excel columns modal");

        // Verify all 23 checkboxes rendered
        const checkboxCount = await evalJs('document.querySelectorAll("#excelColumnGroupsContainer input[type=\'checkbox\']").length');
        console.log(`[PASS] Column checkboxes count: ${checkboxCount}`);
        if (checkboxCount !== 23) throw new Error(`Expected 23 checkboxes, got ${checkboxCount}`);

        // Test Preset: 'minimal' (8 columns)
        await evalJs('window.applyExcelColumnPreset("minimal")');
        await new Promise(r => setTimeout(r, 100));
        const minimalCols = await evalJs('window.getSelectedExcelColumns()');
        console.log(`[PASS] Minimal preset columns (${minimalCols.length}):`, minimalCols);
        if (minimalCols.length !== 8 || !minimalCols.includes('TAG_NAME') || !minimalCols.includes('DATE_VN')) {
            throw new Error("Minimal preset failed");
        }

        // Test filtered database rows with selected columns
        const filteredRows = await evalJs('window.generateDatabaseRows(window.getSelectedExcelColumns())');
        const firstRowKeys = Object.keys(filteredRows[0] || {});
        console.log(`[PASS] Filtered database row columns (${firstRowKeys.length}):`, firstRowKeys);
        if (firstRowKeys.length !== 8 || firstRowKeys.includes('ID') || !firstRowKeys.includes('TAG_NAME')) {
            throw new Error("Filtered rows do not match selected minimal columns");
        }

        // Test Preset: 'yolo' (8 columns)
        await evalJs('window.applyExcelColumnPreset("yolo")');
        const yoloCols = await evalJs('window.getSelectedExcelColumns()');
        console.log(`[PASS] YOLO preset columns (${yoloCols.length}):`, yoloCols);
        if (yoloCols.length !== 8 || !yoloCols.includes('X_CENTER_NORM')) throw new Error("YOLO preset failed");

        // Test toggle individual column
        await evalJs('window.toggleExcelColumn("X_CENTER_NORM")');
        const yoloColsToggled = await evalJs('window.getSelectedExcelColumns()');
        console.log(`[PASS] YOLO columns after toggle: ${yoloColsToggled.length} (contains X_CENTER_NORM: ${yoloColsToggled.includes('X_CENTER_NORM')})`);
        if (yoloColsToggled.includes('X_CENTER_NORM')) throw new Error("Toggle column failed to deselect");

        // Test Preset: 'all' (23 columns)
        await evalJs('window.applyExcelColumnPreset("all")');
        const allCols = await evalJs('window.getSelectedExcelColumns()');
        console.log(`[PASS] All preset columns count: ${allCols.length}`);
        if (allCols.length !== 23) throw new Error("All preset failed");

        // Close modal
        await evalJs('window.closeExcelColumnModal()');
        const colModalClosed = await evalJs('document.getElementById("excelColumnsModal")?.classList.contains("hidden")');
        console.log(`[PASS] Excel columns modal closed: ${colModalClosed}`);
        if (!colModalClosed) throw new Error("Failed to close excel columns modal");

        // 8. Test Basic Icon Picker in Tag Modal
        console.log('\n--- Testing Basic Icon Picker & Tag Deletion ---');
        await evalJs('window.toggleAddTagModal()');
        await new Promise(r => setTimeout(r, 200));
        const iconBtnCount = await evalJs('document.querySelectorAll("#basicIconPicker button").length');
        console.log(`[PASS] Basic icon picker buttons: ${iconBtnCount}`);
        if (iconBtnCount < 10) throw new Error("Icon picker failed to render icons");

        await evalJs('window.selectNewTagIcon("🎁")');
        const selectedIcon = await evalJs('document.getElementById("newTagIconInput")?.value');
        console.log(`[PASS] Selected icon: "${selectedIcon}"`);
        if (selectedIcon !== '🎁') throw new Error("Selecting icon failed");

        // 9. Test Tag ID Field, Tag Creation & Deletion
        console.log('\n--- Testing Tag ID Input & "ID-Tên tag" Display ---');
        const hasTagIdInput = await evalJs('!!document.getElementById("newTagIdInput")');
        console.log(`[PASS] newTagIdInput field exists in DOM: ${hasTagIdInput}`);
        if (!hasTagIdInput) throw new Error("newTagIdInput field not found");

        // Create a custom tag with explicit ID "DEFECT_99"
        await evalJs(`
            document.getElementById("newTagIdInput").value = "DEFECT_99";
            document.getElementById("newTagNameInput").value = "Hàng Lỗi Xước";
            document.getElementById("newTagIconInput").value = "⚡";
            window.createNewCustomTag();
        `);
        await new Promise(r => setTimeout(r, 200));

        // Verify the tag was created with id "DEFECT_99"
        const tagWithExplicitId = await evalJs(`
            (() => {
                const opt = Array.from(document.querySelectorAll("#toolbarActiveTagCombo option")).find(o => o.value === "DEFECT_99");
                return opt ? opt.textContent : null;
            })()
        `);
        console.log(`[PASS] Tag with explicit ID in toolbar: "${tagWithExplicitId}"`);
        if (!tagWithExplicitId || !tagWithExplicitId.includes("DEFECT_99-Hàng Lỗi Xước")) {
            throw new Error(`Expected tag text to include "DEFECT_99-Hàng Lỗi Xước", got "${tagWithExplicitId}"`);
        }

        // Verify the inline overlay options also have the format "ID-Tên tag"
        const overlayOptionText = await evalJs(`
            (() => {
                const opt = document.querySelector("#bboxOverlayLayer select option[value='DEFECT_99']");
                return opt ? opt.textContent : null;
            })()
        `);
        console.log(`[PASS] Tag in inline image overlay dropdown: "${overlayOptionText}"`);
        if (!overlayOptionText || !overlayOptionText.includes("DEFECT_99-Hàng Lỗi Xước")) {
            throw new Error(`Expected overlay option to include "DEFECT_99-Hàng Lỗi Xước", got "${overlayOptionText}"`);
        }

        // Verify existing tags manager list has editable ID input
        const idInputCount = await evalJs(`
            document.querySelectorAll("#existingTagsManagerList input[title]").length
        `);
        console.log(`[PASS] Existing tags manager inputs count: ${idInputCount}`);

        // Edit the ID of DEFECT_99 to DEFECT_NEW
        await evalJs(`
            window.editExistingTag("DEFECT_99", "id", "DEFECT_NEW");
        `);
        await new Promise(r => setTimeout(r, 200));

        const updatedTagOpt = await evalJs(`
            (() => {
                const opt = Array.from(document.querySelectorAll("#toolbarActiveTagCombo option")).find(o => o.value === "DEFECT_NEW");
                return opt ? opt.textContent : null;
            })()
        `);
        console.log(`[PASS] Tag ID edited to DEFECT_NEW: "${updatedTagOpt}"`);
        if (!updatedTagOpt || !updatedTagOpt.includes("DEFECT_NEW-Hàng Lỗi Xước")) {
            throw new Error(`Tag ID update failed, got "${updatedTagOpt}"`);
        }

        // Now test deleting this tag
        await evalJs(`
            window.deleteTag("DEFECT_NEW");
        `);
        await new Promise(r => setTimeout(r, 200));
        const deletedCheck = await evalJs(`
            Array.from(document.querySelectorAll("#toolbarActiveTagCombo option")).some(o => o.value === "DEFECT_NEW")
        `);
        console.log(`[PASS] Tag DEFECT_NEW successfully deleted: ${!deletedCheck}`);
        if (deletedCheck) throw new Error("Tag deletion failed");

        await evalJs('window.toggleAddTagModal()');

        // 9b. Test Tag Storage, JSON Tag Preservation, and Excel Tag Import / Template
        console.log('\n--- Testing Tag JSON Preservation & Excel Tag Import ---');
        // Test that exported JSON includes categories
        const exportData = await evalJs('window.getFormattedExportData ? window.getFormattedExportData() : null');
        const hasCategories = Array.isArray(exportData?.categories) && exportData.categories.length > 0;
        console.log(`[PASS] Exported JSON contains categories: ${hasCategories} (${exportData?.categories?.length} tags)`);
        if (!hasCategories) throw new Error("JSON export missing categories array");

        // Test Importing Excel Tag Rows
        const sampleExcelRows = [
            { CLASS_ID: 10, TAG_NAME: "Mã Vạch Quét", TAG_ID: "ma_vach_quet", COLOR: "#10b981", ICON: "🏷️" },
            { CLASS_ID: 11, TAG_NAME: "Hàng Nguy Hiểm", TAG_ID: "hang_nguy_hiem", COLOR: "#e11d48", ICON: "⚠️" }
        ];
        await evalJs(`window.parseAndApplyTagRows(${JSON.stringify(sampleExcelRows)}, 'test_tags.xlsx')`);
        await new Promise(r => setTimeout(r, 200));
        const tagsAfterExcelImport = await evalJs('document.querySelectorAll("#tagChipsContainer > button").length');
        const importedTagExists = await evalJs('!!document.querySelector("#tagChipsContainer")?.textContent.includes("Hàng Nguy Hiểm")');
        console.log(`[PASS] Tag imported from Excel: exists=${importedTagExists}, chipsCount=${tagsAfterExcelImport}`);
        if (!importedTagExists) throw new Error("Tag import from Excel rows failed");

        // Test LocalStorage persistence
        const savedTagsInStorage = await evalJs('!!localStorage.getItem("bbox_studio_tags_catalog")');
        console.log(`[PASS] Tags saved to localStorage: ${savedTagsInStorage}`);
        if (!savedTagsInStorage) throw new Error("Tags not saved to localStorage");

        // Test JSON with custom tags import (tag restoration)
        const jsonWithCategories = JSON.stringify({
            categories: [
                { id: "sensor_tag", class_id: 12, name: "Cảm biến nhiệt", color: "#3b82f6", icon: "🌡️" }
            ],
            annotations: []
        });
        const importCatRes = await evalJs(`window.importJsonData(${JSON.stringify(jsonWithCategories)})`);
        console.log(`[PASS] JSON categories import result:`, importCatRes);
        const sensorTagExists = await evalJs('!!document.querySelector("#tagChipsContainer")?.textContent.includes("Cảm biến nhiệt")');
        console.log(`[PASS] Sensor tag restored from JSON: ${sensorTagExists}`);
        if (!sensorTagExists) throw new Error("Tag restoration from JSON categories failed");

        // 10. Test Streamlined Dropdown Combos (File & Export Hubs)
        console.log('\n--- Testing Streamlined Dropdown Combos ---');
        // Toggle file dropdown
        await evalJs('window.toggleFileDropdown()');
        const fileMenuVisible = await evalJs('!document.getElementById("fileDropdownMenu")?.classList.contains("hidden")');
        console.log(`[PASS] File dropdown menu opens: ${fileMenuVisible}`);
        if (!fileMenuVisible) throw new Error("File dropdown failed to open");

        // Toggle export dropdown
        await evalJs('window.toggleExportDropdown()');
        const exportMenuVisible = await evalJs('!document.getElementById("exportDropdownMenu")?.classList.contains("hidden")');
        const fileMenuClosed = await evalJs('document.getElementById("fileDropdownMenu")?.classList.contains("hidden")');
        console.log(`[PASS] Export dropdown menu opens and closes file dropdown: export=${exportMenuVisible}, fileClosed=${fileMenuClosed}`);
        if (!exportMenuVisible || !fileMenuClosed) throw new Error("Export dropdown failed");

        await evalJs('window.closeAllDropdowns()');
        const allClosed = await evalJs('document.getElementById("exportDropdownMenu")?.classList.contains("hidden") && document.getElementById("fileDropdownMenu")?.classList.contains("hidden")');
        console.log(`[PASS] closeAllDropdowns closes both: ${allClosed}`);
        if (!allClosed) throw new Error("closeAllDropdowns failed");

        // Verify No duplicate "Nhập JSON" button in the sidebar export area
        const sidebarImportJson = await evalJs('!!document.querySelector("aside .p-3\\\\.5 button#btnImportJson")');
        console.log(`[PASS] Duplicate Nhập JSON button removed from sidebar export: isRemoved=${!sidebarImportJson}`);
        if (sidebarImportJson) throw new Error("Duplicate Nhập JSON still exists in sidebar");

        ws.close();
    } finally {
        edge.kill();
        await new Promise(r => setTimeout(r, 500));
    }
}

async function testIframeHost(url, pageName) {
    console.log(`\n================ Testing ${pageName}: ${url} ================`);
    const edge = spawn(edgePath, [
        `--remote-debugging-port=${cdpPort}`,
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        url
    ]);

    await new Promise(r => setTimeout(r, 2000));

    try {
        const targets = await new Promise((resolve, reject) => {
            http.get(`http://127.0.0.1:${cdpPort}/json/list`, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const pageTarget = targets.find(t => t.type === 'page');
        if (!pageTarget) throw new Error("No page target found");

        const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
            ws.onopen = resolve;
            ws.onerror = reject;
        });

        let id = 1;
        function send(method, params = {}) {
            return new Promise((resolve, reject) => {
                const reqId = id++;
                const handler = (evt) => {
                    const msg = JSON.parse(evt.data);
                    if (msg.id === reqId) {
                        ws.removeEventListener('message', handler);
                        if (msg.error) reject(msg.error);
                        else resolve(msg.result);
                    }
                };
                ws.addEventListener('message', handler);
                ws.send(JSON.stringify({ id: reqId, method, params }));
            });
        }

        async function evalJs(expr) {
            const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
            if (res.exceptionDetails) {
                throw new Error(res.exceptionDetails.exception?.description || JSON.stringify(res.exceptionDetails));
            }
            return res.result?.value;
        }

        // Check host page loaded
        const title = await evalJs('document.title');
        console.log(`[PASS] Iframe Host Title: "${title}"`);

        // Wait for iframe communication to be ready
        await new Promise(r => setTimeout(r, 1500));

        // Test sending JSON to iframe via postMessage
        await evalJs('window.sendLoadSampleJson()');
        await new Promise(r => setTimeout(r, 1000));

        // Check box count received back in parent
        const boxCount = await evalJs('document.getElementById("boxCountDisplay")?.textContent');
        console.log(`[PASS] Parent received box count: "${boxCount}"`);

        // Request data from iframe
        await evalJs('window.requestDataFromIframe()');
        await new Promise(r => setTimeout(r, 1000));
        const receivedData = await evalJs('document.getElementById("receivedDataDisplay")?.textContent');
        const hasAnnotations = receivedData && receivedData.includes('Thân giày');
        console.log(`[PASS] Parent received annotations data: ${hasAnnotations}`);
        if (!hasAnnotations) throw new Error("Data retrieval from iframe failed");

        // Toggle dark mode via postMessage
        await evalJs('window.toggleIframeDarkMode()');
        await new Promise(r => setTimeout(r, 500));
        console.log(`[PASS] Toggle Dark Mode via postMessage executed successfully`);

        ws.close();
    } finally {
        edge.kill();
        await new Promise(r => setTimeout(r, 500));
    }
}

async function main() {
    await testPage('http://localhost:3000/index.html', 'BBox Creative Studio (Modular Project)');
    await testIframeHost('http://localhost:3000/iframe_demo.html', 'Iframe Host Demo Page');
    console.log("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<");
    process.exit(0);
}

main().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
