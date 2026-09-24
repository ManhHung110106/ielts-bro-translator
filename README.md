# 🎓 IELTS Bro (雅思哥) UI Translator

Công cụ chuyển đổi giao diện ứng dụng desktop **IELTS Bro (雅思哥机考软件)** từ tiếng Trung sang **Tiếng Việt** hoặc **Tiếng Anh**.

<p align="center">
  <img src="https://img.shields.io/badge/Language-Vietnamese%20%7C%20English-blue" alt="Language" />
  <img src="https://img.shields.io/badge/Platform-Windows-0078D6" alt="Windows" />
  <img src="https://img.shields.io/badge/Status-Active-brightgreen" alt="Status" />
</p>

---

## 🌟 Tính Năng Nổi Bật

- 🇻🇳 **Dịch giao diện sang Tiếng Việt & Tiếng Anh**: Chuyển đổi toàn diện các menu, danh mục kỹ năng (Nghe, Đọc, Viết, Nói), nút bấm, cài đặt, popup và phiếu làm bài.
- 🎯 **Bảo toàn 100% đề thi**: Toàn bộ nội dung Reading passage, bài nghe Listening, transcript, câu hỏi trắc nghiệm tiếng Anh được **giữ nguyên vẹn tuyệt đối**, không bị can thiệp làm sai lệch bài thi.
- 🛡️ **An toàn & Không làm hỏng app gốc**:
  - Tự động tạo bản backup pp.asar.bak trước khi patch.
  - Hỗ trợ **Khôi phục bản gốc (Restore)** chỉ với 1 phím bấm.
- ⚡ **Tiện lợi 1-Click**: Tích hợp sẵn file batch tự động xin quyền Administrator để người dùng không cần gõ lệnh thủ công.

---

## 🛠️ Yêu Cầu Hệ Thống

- **Hệ điều hành**: Windows 10 / 11
- **Môi trường**: Đã cài đặt [Node.js](https://nodejs.org) (khuyên dùng bản LTS)
- Đã cài đặt ứng dụng **雅思哥机考软件** (IELTS Bro Desktop)

---

## 🚀 Hướng Dẫn Cài Đặt & Sử Dụng

### Cách 1: Tải file Zip từ GitHub
1. Nhấn nút **Code** -> **Download ZIP** ở góc trên repo này.
2. Giải nén thư mục vừa tải về.
3. Chạy file **un_translator.bat** (hoặc click chuột phải chọn *Run as administrator*).

### Cách 2: Sử dụng Git Clone
`ash
git clone https://github.com/ManhHung110106/ielts-bro-translator.git
cd ielts-bro-translator
npm install
run_translator.bat
`

---

## 🖥️ Giao Diện Menu Điều Khiển

Khi chạy un_translator.bat, menu tương tác sẽ xuất hiện:

`	ext
========================================================
      IELTS BRO (雅思哥) UI TRANSLATOR / BẢN DỊCH GIAO DIỆN
========================================================
 [1] Cài đặt bản dịch TIẾNG VIỆT (Vietnamese)
 [2] Cài đặt bản dịch TIẾNG ANH (English)
 [3] Khôi phục giao diện gốc ban đầu (Restore Original)
 [4] Thoát
========================================================
`

- Nhập 1 rồi nhấn Enter để cài đặt giao diện **Tiếng Việt**.
- Nhập 2 rồi nhấn Enter để cài đặt giao diện **Tiếng Anh**.
- Nhập 3 rồi nhấn Enter khi muốn quay lại tiếng Trung nguyên bản.
- Sau khi thông báo thành công, chỉ cần mở lại ứng dụng IELTS Bro là xong!

---

## 📁 Cấu Trúc Mã Nguồn

`	ext
├── run_translator.bat  # Trình khởi chạy 1-click & cấp quyền Admin
├── patcher.js          # Logic trích xuất, chèn script dịch và đóng gói app.asar
├── translator.js       # Module DOM MutationObserver dịch chữ Hán theo thời gian thực
├── dict_vi.json        # Từ điển thuật ngữ IELTS Tiếng Việt
├── dict_en.json        # Từ điển thuật ngữ IELTS Tiếng Anh
├── package.json        # Quản lý thư viện phụ thuộc (@electron/asar)
└── README.md           # Tài liệu hướng dẫn
`

---

## 💡 Đóng Góp Từ Điển (Contribution)

Nếu bạn phát hiện từ ngữ giao diện nào chưa được dịch hoặc muốn cải thiện bản dịch:
1. Mở file dict_vi.json hoặc dict_en.json.
2. Thêm cặp từ theo mẫu:
   `json
   "từ_tiếng_trung": "bản_dịch"
   `
3. Chạy lại un_translator.bat để cập nhật vào ứng dụng.
4. Tạo Pull Request lên repository này!

---

## 📄 Bản Quyền & Miễn Trừ Trách Nhiệm
Dự án được tạo ra nhằm mục đích hỗ trợ học tập cho cộng đồng người học IELTS tại Việt Nam và quốc tế. Dự án không sở hữu bản quyền nội dung của bên thứ ba (IELTS Bro).
