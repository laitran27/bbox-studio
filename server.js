// ==========================================
// ZERO-DEPENDENCY LOCAL WEB SERVER (NODE.JS)
// ==========================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    // Chỉ xử lý GET và HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Method Not Allowed');
        return;
    }

    // Phân tích đường dẫn tệp an toàn
    let requestUrl = req.url.split('?')[0];
    if (requestUrl === '/') requestUrl = '/index.html';

    // Ngăn chặn directory traversal
    const safePath = path.normalize(decodeURIComponent(requestUrl)).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(__dirname, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html lang="vi">
                <head><meta charset="utf-8"><title>404 Not Found</title></head>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h2>404 - Không tìm thấy tệp</h2>
                    <p>Đường dẫn <code>${safePath}</code> không tồn tại trên máy chủ.</p>
                    <a href="/" style="color: #ff2a6d; font-weight: bold;">Quay về Trang chủ</a>
                </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache'
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
    });
});

function openBrowser(url) {
    const startCmd = process.platform === 'win32' ? 'start' :
                     process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${startCmd} ${url}`);
}

server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log('\n======================================================');
    console.log(`🚀 BBox Creative Studio đang chạy tại: ${url}`);
    console.log(`📁 Thư mục gốc: ${__dirname}`);
    console.log('💡 Nhấn Ctrl + C để dừng máy chủ bất cứ lúc nào');
    console.log('======================================================\n');

    // Tự động mở trình duyệt nếu không truyền flag --no-open
    if (!process.argv.includes('--no-open')) {
        openBrowser(url);
    }
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        const nextPort = PORT + 1;
        console.warn(`⚠️ Cổng ${PORT} đã bận, đang chuyển sang cổng ${nextPort}...`);
        server.listen(nextPort, () => {
            const url = `http://localhost:${nextPort}`;
            console.log(`🚀 BBox Creative Studio đang chạy tại: ${url}\n`);
            openBrowser(url);
        });
    } else {
        console.error('Lỗi khởi động máy chủ:', e);
    }
});
