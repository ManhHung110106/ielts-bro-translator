# 🎓 IELTS Bro (雅思哥) UI Translator

Công cụ chuyển đổi giao diện ứng dụng desktop **IELTS Bro (雅思哥机考软件)** từ tiếng Trung sang **Tiếng Việt** hoặc **Tiếng Anh**.

<p align="center">
  <img src="logo.png" width="90" alt="IELTS Bro Translator Logo" /><br/>
  <img src="https://img.shields.io/badge/Giao_di%E1%BB%87n-Minimalist_GUI-ea580c?style=flat-square" alt="GUI" />
  <img src="https://img.shields.io/badge/C%C6%A1_ch%E1%BA%BF-Hybrid_Translation-success?style=flat-square" alt="Translation" />
  <img src="https://img.shields.io/badge/H%E1%BB%87_%C4%91i%E1%BB%81u_h%C3%A0nh-Windows_10%2F11-0078D6?style=flat-square" alt="Windows" />
</p>

---

## 🌟 Tính Năng Nổi Bật

- 🖥️ **Giao diện tối giản, thanh lịch**: Tông màu chủ đạo trắng - đỏ cam, loại bỏ hoàn toàn các hiệu ứng rườm rà (AI slop), hiển thị logo nhận diện ứng dụng.
- 🌐 **Cơ chế Dịch Kết hợp (Hybrid Translation Engine)**:
  - **Từ điển chuyên ngành IELTS**: Đảm bảo các thuật ngữ (Listening, Reading, Task 1, Task 2, Cam, Forecast) chuẩn xác 100%.
  - **Tự động dịch đám mây (Dynamic Cloud Translation)**: Bất kỳ câu từ tiếng Trung mới nào phát sinh mà chưa có trong từ điển sẽ được tự động dịch và lưu vào bộ nhớ đệm (Cache) trên máy.
- 🎯 **Bảo toàn 100% đề thi**: Giữ nguyên bài đọc Reading, bài nghe Listening, bài mẫu Writing và câu hỏi trắc nghiệm tiếng Anh, không gây ảnh hưởng đến việc ôn thi.
- 🛡️ **An toàn & Hoàn tác 1-Click**:
  - Tự động tạo bản sao lưu `app.asar.bak`.
  - Hỗ trợ nút khôi phục về tiếng Trung nguyên bản bất cứ lúc nào.

---

## 🛠️ Yêu Cầu Hệ Thống

- **Hệ điều hành**: Windows 10 / 11
- **Môi trường**: Đã cài đặt [Node.js](https://nodejs.org)
- Đã cài đặt ứng dụng **雅思哥机考软件** (IELTS Bro Desktop)

---

## 🚀 Hướng Dẫn Sử Dụng

1. Tải repository này về máy tính (hoặc `git clone https://github.com/ManhHung110106/ielts-bro-translator.git`).
2. Mở thư mục và click đúp vào file **`run_translator.bat`**.
3. Cửa sổ ứng dụng sẽ tự động mở lên:
   - Nhấn **Cài đặt giao diện Tiếng Việt** để dịch sang Tiếng Việt.
   - Nhấn **Cài đặt giao diện Tiếng Anh** để dịch sang Tiếng Anh.
   - Nhấn **Khôi phục giao diện gốc** nếu muốn quay về tiếng Trung.
4. Mở lại ứng dụng **IELTS Bro** để trải nghiệm giao diện mới!

---

## 📁 Cấu Trúc Dự Án

```text
├── run_translator.bat  # Trình khởi chạy 1-click mở ứng dụng
├── gui_server.js       # Máy chủ giao diện Minimalist trắng - đỏ cam
├── patcher.js          # Logic đóng/gói và cập nhật app.asar
├── translator.js       # Bộ máy dịch Hybrid (Từ điển chuẩn + Dịch động)
├── dict_vi.json        # Từ điển thuật ngữ IELTS Tiếng Việt
├── dict_en.json        # Từ điển thuật ngữ IELTS Tiếng Anh
├── logo.png            # Icon nhận diện ứng dụng
├── logo_white.png      # Logo hiển thị trong giao diện
└── README.md           # Tài liệu hướng dẫn
```