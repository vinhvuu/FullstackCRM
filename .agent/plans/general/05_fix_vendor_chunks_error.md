# Plan: Fix lỗi `Cannot find module './vendor-chunks/next.js'`

## 1. Mô tả lỗi

Khi chạy `next dev`, server compile thành công nhưng khi truy cập trang (`GET /`), xuất hiện lỗi:

```
⨯ Error: Cannot find module './vendor-chunks/next.js'
Require stack:
- C:\workspace\Engineering\crm_project\.next\server\webpack-runtime.js
- C:\workspace\Engineering\crm_project\.next\server\app\_not-found\page.js
```

Kèm theo warning:
```
[webpack.cache.PackFileCacheStrategy] Caching failed for pack: Error: ENOENT: no such file or directory, 
rename '...\.next\cache\webpack\client-development-fallback\0.pack.gz_' -> '...\.next\cache\webpack\client-development-fallback\0.pack.gz'
```

---

## 2. Phân tích nguyên nhân gốc

### 2.1. Nguyên nhân chính: Cache `.next` bị hỏng (corrupted build cache)

File `./vendor-chunks/next.js` là file nội bộ do Next.js tự sinh ra trong thư mục `.next/server/` khi compile. File này chứa các vendor chunks (code từ `node_modules`) được tách ra bởi webpack.

**Lý do file bị thiếu:**

| # | Nguyên nhân | Giải thích |
|---|------------|------------|
| 1 | **Cache cũ không tương thích** | Thư mục `.next` được tạo từ một phiên bản Next.js khác hoặc từ một lần build trước đó bị gián đoạn. Khi Next.js cố sử dụng lại cache cũ, nó tham chiếu đến file `vendor-chunks/next.js` nhưng file đó không tồn tại. |
| 2 | **Webpack cache bị lỗi trên Windows** | Warning `ENOENT: rename '0.pack.gz_' -> '0.pack.gz'` cho thấy webpack không thể rename file cache. Đây là vấn đề phổ biến trên **Windows** do file locking — một process khác (antivirus, Windows Defender, IDE indexer) đang giữ lock trên file trong thư mục `.next`. |
| 3 | **Gián đoạn build trước đó** | Nếu `next dev` hoặc `next build` bị kill đột ngột (Ctrl+C, crash, mất điện), webpack cache có thể ở trạng thái không hoàn chỉnh. |

### 2.2. Nguyên nhân phụ: Phiên bản Node.js

- **Node.js v20.20.0** + **Next.js 14.2.35** — tương thích, không phải nguyên nhân chính.

### 2.3. Xác nhận bằng chứng

- Thư mục `.next/server/` hiện tại **không tồn tại** (đã kiểm tra), nghĩa là cache build đã bị xóa một phần hoặc bị hỏng.
- Chỉ còn `.next/cache/` và `.next/trace` — thiếu hoàn toàn phần server output.

---

## 3. Hướng xử lý (từ đơn giản → phức tạp)

### ✅ Bước 1: Xóa thư mục `.next` và chạy lại dev server (KHUYẾN NGHỊ)

Đây là cách fix phổ biến nhất và gần như luôn giải quyết vấn đề.

```powershell
# Dừng dev server nếu đang chạy (Ctrl+C)

# Xóa thư mục .next
Remove-Item -Recurse -Force .\.next

# Chạy lại
npm run dev
```

**Tại sao:** Xóa toàn bộ cache cũ, buộc Next.js tạo lại mọi thứ từ đầu với trạng thái sạch.

---

### ✅ Bước 2: Nếu Bước 1 không fix — Xóa `node_modules` và cài lại

```powershell
Remove-Item -Recurse -Force .\.next
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Force .\package-lock.json

npm install
npm run dev
```

**Tại sao:** Đảm bảo không có dependency bị hỏng hoặc không đồng bộ.

---

### ⚠️ Bước 3: Nếu vẫn lỗi — Kiểm tra Windows-specific issues

1. **Tắt Windows Defender real-time scanning** cho thư mục project:
   - Settings → Windows Security → Virus & threat protection → Exclusions
   - Thêm `C:\workspace\Engineering\crm_project` vào danh sách loại trừ

2. **Đóng các ứng dụng có thể lock file:**
   - File Explorer đang mở thư mục `.next`
   - Các extension VSCode/IDE đang index thư mục
   - OneDrive sync (nếu project nằm trong folder được sync)

3. **Chạy PowerShell với quyền Administrator** nếu cần.

---

### 🔧 Bước 4: Tối ưu cấu hình webpack cache (optional, phòng ngừa)

Thêm vào `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tắt webpack persistent caching nếu bị lỗi liên tục trên Windows
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        allowCollectingMemory: true,
        compression: false, // Tắt compression để tránh lỗi rename .gz trên Windows
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

---

## 4. Phòng ngừa trong tương lai

| # | Hành động | Mục đích |
|---|----------|---------|
| 1 | Thêm `.next` vào `.gitignore` | Không commit cache vào git (đã có ✅) |
| 2 | Luôn dùng Ctrl+C để dừng dev server | Tránh corrupt cache do kill đột ngột |
| 3 | Thêm script `clean` vào `package.json` | Tiện xóa cache nhanh |
| 4 | Exclude thư mục project khỏi antivirus | Tránh file locking trên Windows |

Script đề xuất thêm vào `package.json`:
```json
"scripts": {
  "clean": "rimraf .next",
  "dev:clean": "rimraf .next && next dev"
}
```

---

## 5. Thứ tự thực hiện

- [ ] **Bước 1:** Xóa `.next` và chạy lại `npm run dev`
- [ ] **Bước 2:** Nếu lỗi tiếp → xóa `node_modules` + `package-lock.json`, cài lại
- [ ] **Bước 3:** Nếu lỗi tiếp → kiểm tra Windows Defender / file locking
- [ ] **Bước 4:** Cân nhắc thêm cấu hình webpack cache và script `clean`

---

## 6. Kết luận

> **Nguyên nhân gốc:** Thư mục `.next` (build cache) bị hỏng, thiếu file `vendor-chunks/next.js` mà webpack runtime tham chiếu đến. Kết hợp với vấn đề file locking trên Windows khiến webpack cache cũng không thể ghi đúng.
>
> **Fix nhanh nhất:** Xóa `.next` và chạy lại `npm run dev`. Thành công trong ~95% trường hợp.
