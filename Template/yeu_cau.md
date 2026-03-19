# Yêu Cầu Thiết Kế Giao Diện (HTML/CSS) Cho Dự Án Personal Knowledge Graph

Đóng vai là một Chuyên gia thiết kế UI/UX và Lập trình viên Frontend kỳ cựu. Nhiệm vụ của bạn là thiết kế và viết code cho một bộ **Template Website Multi-page (Nhiều trang)** hoàn chỉnh cho ứng dụng **Personal Knowledge Graph (PKG)** - một hệ thống quản lý ghi chú dạng mạng lưới liên kết.

## Yêu cầu kỹ thuật cốt lõi:
1. **Ngôn ngữ:** Chỉ sử dụng **HTML5** và **CSS3 thuần**. Tuyệt đối không dùng JavaScript, không dùng framework CSS (như Tailwind, Bootstrap).
2. **Phong cách thiết kế:** Hiện đại, tối giản (Minimalist), UI/UX gọn gàng. Dùng tông màu **Dark Mode** chuyên nghiệp làm chủ đạo (như màu xám đen của Obsidian/Notion).
3. **Cấu trúc code:** Semantic HTML. CSS phải sạch sẽ, có comment rõ ràng phân chia các khu vực, sử dụng Flexbox/CSS Grid để dàn trang, và phải **đáp ứng tốt (Responsive)** trên cả Desktop và Mobile.
4. **Layout chung:** Các trang (trừ Login/404) phải chia sẻ chung một bộ khung (Sidebar bên trái hoặc Header bên trên) để điều hướng.

## Danh sách các trang cần tạo (Mỗi trang là 1 file .html, dùng chung 1 file style.css):

### 1. Trang Admin Dashboard (`admin.html`) - Dành cho Quản trị viên
* **Mục đích:** Quản lý toàn bộ hệ thống (dành cho role Admin).
* **Thành phần:**
  * Các thẻ thống kê (Stats cards): Tổng số User, Tổng số Note toàn hệ thống, Lưu lượng truy cập.
  * Biểu đồ giả lập (bằng CSS/SVG đơn giản) thể hiện lượng user mới đăng ký.
  * Bảng quản lý người dùng (User Management Table): Cột ID, Email, Role, Trạng thái (Active/Banned), và nút hành động (Edit/Delete/Ban).

### 2. Trang User Dashboard (`index.html`) - Dành cho Người dùng cá nhân
* **Mục đích:** Tổng quan "bộ não thứ hai" của người dùng.
* **Thành phần:**
  * Thống kê cá nhân: Tổng số ghi chú, Số lượng liên kết.
  * Danh sách "Ghi chú tạo gần đây" và "Ghi chú đã lâu không mở".
  * Khu vực "Gợi ý liên kết" giả lập.

### 3. Trang Editor / Chi tiết Ghi chú (`editor.html`)
* **Mục đích:** Nơi soạn thảo và xem liên kết của 1 ghi chú (Trang quan trọng nhất).
* **Thành phần:**
  * Bố cục 2 hoặc 3 cột.
  * **Cột chính:** Khu vực soạn thảo văn bản (dùng `<div contenteditable="true">` hoặc `<textarea>`), thiết kế kiểu typography đẹp mắt để hiển thị Markdown.
  * **Cột phụ (Right Panel):** Khu vực hiển thị **Backlinks** (Những note khác đang trỏ tới note này).
  * Hiển thị Tag và Meta data (ngày tạo, ngày sửa).

### 4. Trang Graph View (`graph.html`)
* **Mục đích:** Hiển thị mạng lưới tri thức.
* **Thành phần:**
  * Một khu vực trung tâm rộng lớn (`<div>` lớn) với màu nền canvas.
  * Ở giữa để một dòng text: "Interactive Knowledge Graph Placeholder (D3.js integration)".
  * Bảng điều khiển nhỏ trôi nổi (Floating panel) chứa các nút: Zoom in, Zoom out, Filter Nodes.

### 5. Trang Explorer / Quản lý kho (`explorer.html`)
* **Mục đích:** Liệt kê toàn bộ ghi chú của user.
* **Thành phần:**
  * Thanh tìm kiếm và bộ lọc (Filter by Tags, Sort by Date) ở trên cùng.
  * Danh sách ghi chú hiển thị dưới dạng Bảng (Table) hoặc dạng Lưới (Grid cards) sạch sẽ.

### 6. Trang Kết quả tìm kiếm (`search.html`)
* **Mục đích:** Tìm kiếm toàn văn bản (Full-text search).
* **Thành phần:**
  * Thanh tìm kiếm khổng lồ nổi bật.
  * Danh sách kết quả: Mỗi item có Tiêu đề ghi chú và một đoạn text ngắn (snippet) bôi đậm từ khóa tìm kiếm.

### 7. Trang Cài đặt (`settings.html`)
* **Mục đích:** Cài đặt tài khoản người dùng.
* **Thành phần:**
  * Form cập nhật thông tin cá nhân (Avatar, Tên, Email, Đổi mật khẩu).
  * Nút Toggle bật/tắt giao diện (Light/Dark mode).
  * Khu vực Danger Zone: Nút xóa tài khoản hoặc Export Data.

### 8. Trang Đăng nhập / Đăng ký (`login.html`)
* **Mục đích:** Cổng vào ứng dụng.
* **Thành phần:**
  * Bố cục căn giữa toàn màn hình (Center screen).
  * Form UI hiện đại có tabs chuyển đổi giữa Login và Register.

### 9. Trang Lỗi (`404.html`)
* **Mục đích:** Xử lý điều hướng sai.
* **Thành phần:** Giao diện tối giản báo lỗi không tìm thấy trang, kèm nút "Quay lại Dashboard".

Hãy bắt đầu sinh ra code cho từng file. Cung cấp file `style.css` trước, sau đó lần lượt đến các file HTML.