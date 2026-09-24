# 🎓 IELTS Bro (雅思哥) Translator

> **Công cụ hỗ trợ dịch giao diện nền tảng luyện thi IELTS Bro (雅思哥机考软件) sang Tiếng Việt & Tiếng Anh trên cả Desktop App và Trình duyệt Web.**

<p align="center">
  <img src="logo.png" width="90" alt="IELTS Bro Translator Logo" /><br/><br/>
  <a href="https://github.com/ManhHung110106/ielts-bro-translator/stargazers">
    <img src="https://img.shields.io/github/stars/ManhHung110106/ielts-bro-translator?style=for-the-badge&color=ea580c&logo=github" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/sponsors/ManhHung110106">
    <img src="https://img.shields.io/badge/Sponsor-Donate-ea580c?style=for-the-badge&logo=github-sponsors" alt="Sponsor" />
  </a>
</p>

---

## 📖 Giới Thiệu

**IELTS Bro (雅思哥)** là nền tảng luyện thi IELTS hàng đầu do Trung Quốc phát triển. Ứng dụng này sở hữu hệ thống mô phỏng bài thi trên máy tính (**IELTS on Computer**) giống 100% khi thi thật tại IDP / BC, đồng thời tích hợp đầy đủ kho đề Cambridge cùng các bộ đề dự đoán (**Forecast**) Writing và Speaking cực kỳ sát với các kỳ thi thực tế.

Tuy nhiên, do phần mềm và website được thiết kế hoàn toàn bằng **tiếng Trung**, người học IELTS tại Việt Nam và quốc tế gặp rất nhiều rào cản khi thao tác, tìm đề hay nộp bài.

Nhằm hỗ trợ cộng đồng người Việt tự học và ôn luyện IELTS hiệu quả nhất, dự án **IELTS Bro Translator** ra đời, mang đến giải pháp dịch toàn diện:
1. **Lựa chọn 1**: Ứng dụng Patcher giao diện đồ họa (GUI) 1-click cho phần mềm **Desktop App**.
2. **Lựa chọn 2**: Tiện ích mở rộng **Chrome Extension** dùng trực tiếp khi luyện thi trên nền tảng web [pc-new.ieltsbro.com](https://pc-new.ieltsbro.com/).

---

## ✨ Tính Năng Nổi Bật

- 🇻🇳 **Dịch sang Tiếng Việt & Tiếng Anh**: Chuyển đổi toàn diện các menu điều hướng, nút bấm, hướng dẫn làm bài, bảng điểm và cài đặt.
- 🎯 **Bảo toàn 100% đề thi**: Bài đọc Reading, bài nghe Listening, bài mẫu Writing và câu hỏi trắc nghiệm tiếng Anh được **giữ nguyên bản tuyệt đối**, không bị dịch sai lệch ngữ cảnh làm bài thi.
- ⚡ **Công nghệ Dịch Hybrid**:
  - Tích hợp sẵn bộ từ điển chuyên ngành IELTS chuẩn xác nhất.
  - Tự động gọi dịch đám mây và lưu vào bộ nhớ đệm (Cache) đối với các câu từ, thông báo mới phát sinh.
- 🛡️ **An toàn & Hoàn tác 1-Click**: Tự động sao lưu bản gốc (`app.asar.bak`), cho phép khôi phục về tiếng Trung nguyên bản bất cứ lúc nào.

---

## 🛠️ Hướng Dẫn Cài Đặt Từ A - Z

### Bước 1: Chuẩn bị tài khoản WeChat & Đăng nhập IELTS Bro

Để sử dụng nền tảng IELTS Bro (cả Web và App), bạn cần tài khoản WeChat để quét mã đăng nhập:

1. **Tải & Đăng ký WeChat**: Tải ứng dụng **WeChat** trên điện thoại (App Store hoặc Google Play) và đăng ký tài khoản.
2. **Đăng nhập trên Web hoặc Desktop App**:
   - Khi mở IELTS Bro, màn hình sẽ hiển thị một mã QR đăng nhập.
   - Mở ứng dụng **WeChat** trên điện thoại -> Chọn biểu tượng dấu **+** ở góc trên cùng bên phải -> Chọn **Quét (Scan)** -> Quét mã QR trên màn hình máy tính -> Nhấn **Cho phép đăng nhập (Confirm Login)** trên điện thoại.
   - Tài khoản của bạn đã được kết nối thành công!

---

### Bước 2: Cài đặt công cụ Dịch (Chọn 1 trong 2 cách)

#### 🌟 Cách 1: Dịch Ứng Dụng Desktop (Desktop App)
*Dành cho bạn nào đã tải phần mềm IELTS Bro về máy tính Windows.*

1. Tải dự án này về máy ([Tải bản Release v1.0.0 (ZIP)](https://github.com/ManhHung110106/ielts-bro-translator/releases/latest) hoặc `git clone`).
2. Mở thư mục và click đúp vào file **`run_translator.bat`**.
3. Cửa sổ ứng dụng sẽ mở lên:
   - Nhấn **🇻🇳 Tiếng Việt** hoặc **🇬🇧 Tiếng Anh**.
   - Ứng dụng IELTS Bro sẽ **tự động được mở lên** với giao diện mới!
   - *(Khi cần quay về tiếng Trung, chỉ cần nhấn **Khôi phục cài đặt gốc**).*

---

#### 🌐 Cách 2: Dịch Trực Tiếp Trên Nền Tảng Web (Chrome Extension)
*Dành cho bạn nào làm bài thi trực tiếp trên trình duyệt tại [pc-new.ieltsbro.com](https://pc-new.ieltsbro.com/).*

1. Tải bộ cài từ mục [Releases](https://github.com/ManhHung110106/ielts-bro-translator/releases/latest) (hoặc tải toàn bộ mã nguồn về máy).
2. Mở trình duyệt Chrome (hoặc Edge, Cốc Cốc, Brave).
3. Truy cập vào đường dẫn quản lý tiện ích:
   - Trên Chrome: `chrome://extensions`
   - Trên Edge: `edge://extensions`
4. Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
5. Nhấn nút **Tải tiện ích đã giải nén (Load unpacked)** -> Chọn thư mục **`extension`** nằm bên trong thư mục dự án này.
6. Truy cập vào trang web [https://pc-new.ieltsbro.com/](https://pc-new.ieltsbro.com/):
   - Nhấp vào icon tiện ích **IELTS Bro Web** trên thanh công cụ trình duyệt để đổi ngôn ngữ hoặc bật/tắt dịch theo ý muốn!

---

## 💖 Lời Cảm Ơn & Ủng Hộ

Chúc các bạn có một quá trình ôn luyện thật hiệu quả và đạt được band điểm IELTS mơ ước (6.5+, 8.0+ Target)!

Nếu bạn thấy công cụ này hữu ích và tiết kiệm thời gian cho bạn:
- Hãy dành tặng dự án **1 sao (⭐ Star)** ở góc phải trên cùng của repository này nhé!
- Mọi sự đóng góp và ủng hộ (**Sponsor / Donate**) qua [GitHub Sponsors](https://github.com/sponsors/ManhHung110106) sẽ là nguồn động viên to lớn để tôi tiếp tục duy trì và cập nhật thêm nhiều tính năng hay hơn nữa cho cộng đồng!
---

## 📜 Giấy Phép & Bản Quyền (License)
Chi tiết xem tại file [LICENSE](LICENSE).
