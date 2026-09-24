# IELTS Bro (雅思哥) UI Translator

Công cụ chuyển đổi giao diện ứng dụng desktop **IELTS Bro (雅思哥机考软件)** từ tiếng Trung sang **Tiếng Việt** hoặc **Tiếng Anh**.

---

### ✨ Tính năng nổi bật
- 🌐 **Dịch giao diện sạch sẽ**: Chuyển đổi toàn bộ Menu, Nút bấm, Cài đặt, Danh mục đề thi, Bảng điểm sang Tiếng Việt / Tiếng Anh.
- 🎯 **Bảo toàn 100% đề thi**: Toàn bộ nội dung Reading passage, Listening transcript, câu hỏi trắc nghiệm tiếng Anh được **giữ nguyên vẹn tuyệt đối**, không bị dịch sai lệch ngữ cảnh luyện thi.
- 🛡️ **An toàn tuyệt đối**: Tự động tạo bản sao lưu (pp.asar.bak). Người dùng có thể quay lại giao diện gốc bất cứ lúc nào với **1 cú click**.
- 🚀 **Cực kỳ tiện lợi**: Không cần cài đặt phức tạp, có sẵn menu tương tác.

---

### 📦 Hướng dẫn cài đặt & sử dụng

1. **Yêu cầu**: Máy tính đã cài đặt [Node.js](https://nodejs.org) (phiên bản 18 trở lên).
2. Tải repository này về máy tính (hoặc git clone https://github.com/<your-username>/ielts-bro-translator.git).
3. Mở thư mục vừa tải về, chạy file:
   `cmd
   run_translator.bat
   `
4. Menu sẽ hiện ra:
   - Nhấn 1 để cài đặt **Tiếng Việt**.
   - Nhấn 2 để cài đặt **Tiếng Anh**.
   - Nhấn 3 để **Khôi phục giao diện gốc**.

---

### 📂 Cấu trúc dự án
- un_translator.bat: Trình khởi chạy 1-click có hỗ trợ xin quyền Administrator tự động.
- patcher.js: Script Node.js giải nén và patch pp.asar.
- 	ranslator.js: Module frontend injection sử dụng MutationObserver để tự động dịch các chuỗi chữ Hán theo thời gian thực.
- dict_vi.json: Từ điển Tiếng Việt chuẩn IELTS.
- dict_en.json: Từ điển Tiếng Anh giao diện.

---

### 🤝 Đóng góp từ điển (Contribution)
Bạn có thể bổ sung thêm các từ ngữ giao diện vào file dict_vi.json hoặc dict_en.json theo dạng:
`json
{
  "từ_tiếng_trung": "bản_dịch_tiếng_việt"
}
`
Sau đó chạy lại un_translator.bat để cập nhật từ điển mới vào ứng dụng.
