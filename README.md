# 🎓 IELTS Bro (雅思哥) UI Translator

Ứng dụng giao diện đồ họa (GUI) chuyển đổi giao diện **IELTS Bro Desktop (雅思哥机考软件)** từ tiếng Trung sang **Tiếng Việt** hoặc **Tiếng Anh**.

<p align="center">
  <img src="https://img.shields.io/badge/Interface-Modern%20GUI-blue?style=for-the-badge" alt="GUI" />
  <img src="https://img.shields.io/badge/Language-Ti%E1%BA%BFng%20Vi%E1%BB%87t%20%7C%20English-success?style=for-the-badge" alt="Language" />
  <img src="https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011-0078D6?style=for-the-badge" alt="Windows" />
</p>

---

## 🌟 Tính Năng Nổi Bật

- 🖥️ **Giao diện người dùng đồ họa (GUI)**: Không cần dùng dòng lệnh CMD, khởi chạy trực tiếp dưới dạng cửa sổ phần mềm đẹp mắt và trực quan.
- 🇻🇳 **Bản dịch Tiếng Việt & Tiếng Anh đầy đủ**: Dịch toàn bộ Menu, Nút bấm, Cài đặt, Danh mục đề thi, Phiếu trả lời sang Tiếng Việt hoặc Tiếng Anh.
- 🎯 **Bảo toàn 100% đề thi**: Toàn bộ nội dung Reading passage, Listening transcript, câu hỏi trắc nghiệm tiếng Anh được **giữ nguyên vẹn tuyệt đối**, không bị can thiệp làm sai lệch bài thi.
- 🛡️ **An toàn & Hoàn tác 1-Click**:
  - Tự động tạo bản backup `app.asar.bak` trước khi áp dụng bản dịch.
  - Hỗ trợ nút **Khôi phục giao diện gốc** chỉ với 1 cú click.

---

## 🛠️ Yêu Cầu Hệ Thống

- **Hệ điều hành**: Windows 10 / 11
- **Môi trường**: Đã cài đặt [Node.js](https://nodejs.org) (bản LTS)
- Đã cài đặt ứng dụng **雅思哥机考软件** (IELTS Bro)

---

## 🚀 Hướng Dẫn Sử Dụng

1. Tải repository này về máy tính (hoặc `git clone https://github.com/ManhHung110106/ielts-bro-translator.git`).
2. Mở thư mục và click đúp vào file **`run_translator.bat`**.
3. Cửa sổ ứng dụng **IELTS Bro UI Translator** sẽ tự động mở lên:
   - Nhấn **🇻🇳 Cài đặt Giao diện Tiếng Việt** để dịch sang Tiếng Việt.
   - Nhấn **🇬🇧 Cài đặt Giao diện Tiếng Anh** để dịch sang Tiếng Anh.
   - Nhấn **↺ Khôi phục giao diện gốc** để quay lại tiếng Trung ban đầu.
4. Mở lại ứng dụng **IELTS Bro** để trải nghiệm giao diện mới!

---

## 📁 Cấu Trúc Mã Nguồn

```text
├── run_translator.bat  # Trình khởi chạy 1-click mở giao diện GUI
├── gui_server.js       # Máy chủ giao diện cục bộ (Glassmorphism UI)
├── patcher.js          # Logic trích xuất, chèn script dịch và đóng gói app.asar
├── translator.js       # Module DOM MutationObserver dịch chữ Hán theo thời gian thực
├── dict_vi.json        # Từ điển thuật ngữ IELTS Tiếng Việt
├── dict_en.json        # Từ điển thuật ngữ IELTS Tiếng Anh
├── package.json        # Quản lý thư viện phụ thuộc (@electron/asar)
└── README.md           # Tài liệu hướng dẫn
```

---

## 💡 Đóng Góp Từ Điển (Contribution)

Nếu bạn muốn đóng góp thêm từ vựng hoặc chỉnh sửa bản dịch:
1. Mở file `dict_vi.json` hoặc `dict_en.json`.
2. Thêm hoặc sửa từ theo định dạng:
   ```json
   "từ_tiếng_trung": "bản_dịch"
   ```
3. Mở ứng dụng và nhấn lại nút cài đặt ngôn ngữ để cập nhật.
4. Tạo Pull Request lên repository này!