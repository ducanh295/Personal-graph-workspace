# 🗺️ LỘ TRÌNH PHÁT TRIỂN DỰ ÁN PKG (2 TUẦN)
> **Dự án:** Personal Knowledge Graph (PKG)
> **Mục tiêu:** Bài tập lớn môn MongoDB (NoSQL) — CRUD đầy đủ + Thành thạo MongoDB nâng cao
> **Deadline:** 01/04/2026 (14 ngày kể từ 18/03/2026)
> **Tech Stack:** Node.js (Express + TypeScript) | React (Vite) | MongoDB (Mongoose)

> [!IMPORTANT]
> **Chiến lược cốt lõi:** Đây là bài thi **môn MongoDB**, không phải môn Frontend. Giao diện React đã xong 100%. Giờ phải tập trung toàn lực vào Backend + các kỹ thuật MongoDB nâng cao (`Aggregation Pipeline`, `$graphLookup`, `Text Index`, `Compound Index`) để ăn trọn điểm.

---

## 📊 TÌNH TRANG HIỆN TẠI CỦA DỰ ÁN

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Frontend (React/Vite) | ✅ Hoàn thành | 9 trang, Layout, Routing, Responsive, Dark/Light mode |
| Backend Setup | 🔲 Chỉ có [package.json](file:///d:/Code/MongoDB/Project/Website_PKG/package.json) | Đã cài Express, Mongoose, JWT, bcrypt, cors |
| MongoDB Schema | 🔲 Chưa bắt đầu | — |
| API CRUD | 🔲 Chưa bắt đầu | — |
| Đấu nối FE ↔ BE | 🔲 Chưa bắt đầu | — |

**Backend dependencies đã cài sẵn:** `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `express-validator`, `cors`, `dotenv`, `morgan`, [tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/App.tsx)

---

## 🏗️ KIẾN TRÚC THƯ MỤC BACKEND MỤC TIÊU

```
Backend/src/
├── index.ts              ← Entry point (khởi server + connect MongoDB)
├── config/
│   └── db.ts             ← Hàm kết nối MongoDB (Mongoose)
├── models/               ← Mongoose Schemas (Bộ xương dữ liệu)
│   ├── User.ts
│   ├── Note.ts
│   └── Link.ts
├── routes/               ← Định tuyến API endpoints
│   ├── auth.routes.ts
│   ├── note.routes.ts
│   ├── link.routes.ts
│   ├── search.routes.ts
│   └── stats.routes.ts
├── controllers/          ← Xử lý logic nhận request, trả response
│   ├── auth.controller.ts
│   ├── note.controller.ts
│   ├── link.controller.ts
│   ├── search.controller.ts
│   └── stats.controller.ts
├── middlewares/
│   └── auth.middleware.ts ← Chặn request không có JWT Token
└── validators/
    ├── auth.validator.ts  ← Validate input đăng ký/đăng nhập
    └── note.validator.ts  ← Validate input tạo/sửa Note
```

---

## 🧠 THIẾT KẾ DATABASE (MongoDB Schema Design)

Đây là phần **ăn điểm nhất** của bài thi NoSQL. Schema phải thể hiện rõ khi nào dùng **Embedding** (gộp chung) và khi nào dùng **Referencing** (tách riêng).

### Collection `users`
```js
{
  _id: ObjectId,
  displayName: String,         // Tên hiển thị
  email: String,               // unique index
  passwordHash: String,        // Bcrypt hash
  avatarUrl: String,           // URL ảnh đại diện (optional)
  theme: "dark" | "light",     // Lưu theme preference
  createdAt: Date,
  updatedAt: Date
}
// Index: { email: 1 } — unique
```

### Collection `notes` ⭐ (Trọng tâm)
```js
{
  _id: ObjectId,
  userId: ObjectId,            // ref → users (AI: Referencing pattern)
  title: String,
  content: String,             // Nội dung Markdown
  tags: [String],              // Embedding pattern (mảng gắn trực tiếp)
  wordCount: Number,           // Tính tự động khi save
  createdAt: Date,
  updatedAt: Date
}
// Indexes:
//   { userId: 1, updatedAt: -1 }      — Compound Index (lọc + sắp xếp)
//   { tags: 1 }                        — Multikey Index (tìm theo tag)
//   { title: "text", content: "text" } — Full-text Search Index ⭐
```
> [!TIP]
> **Điểm khoe:** Dùng `Compound Index` thay vì `Single Index` chứng minh hiểu rõ cách MongoDB sắp xếp B-Tree. Dùng `Text Index` chứng minh biết Full-text Search không cần Elasticsearch.

### Collection `links` ⭐ (Liên kết 2 chiều — Trái tim PKG)
```js
{
  _id: ObjectId,
  sourceNoteId: ObjectId,      // ref → notes (Note chứa dòng [[...]])
  targetNoteId: ObjectId,      // ref → notes (Note được nhắc đến)
  userId: ObjectId,            // ref → users
  createdAt: Date
}
// Indexes:
//   { sourceNoteId: 1, targetNoteId: 1 } — Compound (tra cứu nhanh)
//   { targetNoteId: 1 }                  — Tra Backlinks
//   { userId: 1 }                        — Lọc theo user
```
> [!IMPORTANT]
> **Tại sao tách `links` thành Collection riêng thay vì nhét mảng vào `notes`?**
> Vì mỗi Note có thể link đến hàng trăm Note khác. Nếu Embedding thì document `notes` sẽ phình to vượt 16MB (giới hạn BSON). Tách ra thành Referencing + `$graphLookup` = kiến trúc chuẩn Graph Database trên nền NoSQL.

---

# 📅 LỘ TRÌNH 14 NGÀY CHI TIẾT

## TUẦN 1: BACKEND & MONGODB MASTERY
> *Mục tiêu: API hoạt động đầy đủ, MongoDB query nâng cao chạy mượt*

---

### 📌 Ngày 1 (19/03) — Dựng Khung Xương Backend
**Mục tiêu:** Server chạy được, kết nối MongoDB thành công, tạo file `.env`

| Việc | File | Chi tiết |
|---|---|---|
| Tạo cấu trúc thư mục | `Backend/src/*` | Tạo tất cả folder theo kiến trúc ở trên |
| Entry point | `src/index.ts` | Import Express, gọi `connectDB()`, listen port |
| Kết nối DB | `src/config/db.ts` | `mongoose.connect(process.env.MONGO_URI)` |
| Environment | `.env` | `PORT=5000`, `MONGO_URI=mongodb://...`, `JWT_SECRET=...` |
| Test | — | Chạy `npm run dev`, thấy log "Connected to MongoDB" |

---

### 📌 Ngày 2 (20/03) — Schema + Auth API (Register/Login)
**Mục tiêu:** Đăng ký/Đăng nhập hoạt động, trả về JWT Token

| Việc | File | Chi tiết |
|---|---|---|
| User Model | `models/User.ts` | Schema + unique email index |
| Auth Validator | `validators/auth.validator.ts` | Validate email, password (express-validator) |
| Register API | `POST /api/auth/register` | Hash password (bcrypt) → lưu vào DB → trả JWT |
| Login API | `POST /api/auth/login` | So khớp password → trả JWT |
| Auth Middleware | `middlewares/auth.middleware.ts` | Kiểm tra `Bearer <token>` từ Header |

**Kỹ năng MongoDB:** Index unique trên email, Schema validation

---

### 📌 Ngày 3 (21/03) — CRUD Notes (Phần 1: Create + Read)
**Mục tiêu:** Tạo và lấy danh sách Note, có phân trang

| Việc | File | Chi tiết |
|---|---|---|
| Note Model | `models/Note.ts` | Schema + Compound Index + Text Index |
| Create Note | `POST /api/notes` | Validate → tạo Note → tính wordCount → save |
| Get All Notes | `GET /api/notes` | Phân trang `?page=1&limit=10` + sort by `updatedAt` |
| Get Note by ID | `GET /api/notes/:id` | Tìm theo `_id` + kiểm tra `userId` ownership |

**Kỹ năng MongoDB:** `.find().sort().skip().limit()`, Compound Index `{ userId, updatedAt }`

---

### 📌 Ngày 4 (22/03) — CRUD Notes (Phần 2: Update + Delete) + Tags
**Mục tiêu:** Sửa/Xóa Note, lọc theo Tag

| Việc | File | Chi tiết |
|---|---|---|
| Update Note | `PUT /api/notes/:id` | Validate → `findOneAndUpdate()` → trả Note mới |
| Delete Note | `DELETE /api/notes/:id` | `findOneAndDelete()` + xóa luôn các Links liên quan |
| Filter by Tag | `GET /api/notes?tag=mongodb` | Query `{ tags: "mongodb" }` dùng Multikey Index |
| Note Validator | `validators/note.validator.ts` | Validate title, content, tags[] |

**Kỹ năng MongoDB:** `findOneAndUpdate()`, `deleteMany()` cascade, Multikey Index trên Array

---

### 📌 Ngày 5 (23/03) — Liên Kết 2 Chiều (Bi-directional Links) ⭐
**Mục tiêu:** Khi save Note, tự động phân tích `[[...]]` và tạo Link records

| Việc | File | Chi tiết |
|---|---|---|
| Link Model | `models/Link.ts` | Schema + Compound Index |
| Parse `[[...]]` | `controllers/note.controller.ts` | Regex `/\[\[(.+?)\]\]/g` quét content → tìm Note target |
| Create Links | `POST /api/notes` (update logic) | Khi save Note → xóa links cũ → tạo links mới |
| Get Backlinks | `GET /api/notes/:id/backlinks` | Query `links` where `targetNoteId = :id` → populate sourceNote |

**Kỹ năng MongoDB:** `$lookup` (JOIN trong NoSQL), `bulkWrite()`, Regex

---

### 📌 Ngày 6 (24/03) — Aggregation Pipeline + Dashboard Stats ⭐⭐
**Mục tiêu:** API thống kê Dashboard bằng Aggregation Pipeline (ĂN ĐIỂM TỐI ĐA)

| Việc | File | Chi tiết |
|---|---|---|
| Stats API | `GET /api/stats/dashboard` | Dùng `aggregate()` pipeline |
| Pipeline 1 | — | `$match` → `$group` → đếm tổng Notes, tổng Tags, avg wordCount |
| Pipeline 2 | — | `$group` theo ngày (`$dateToString`) → đếm Notes tạo mỗi ngày (dữ liệu biểu đồ) |
| Pipeline 3 | — | `$unwind` tags → `$group` → Top 5 tags phổ biến nhất |
| Full-text Search | `GET /api/search?q=keyword` | `Note.find({ $text: { $search: query } })` với `$meta: "textScore"` |

**Kỹ năng MongoDB:** `$match`, `$group`, `$project`, `$sort`, `$unwind`, `$dateToString`, `$text`, `$meta`

> [!CAUTION]
> **ĐÂY LÀ NGÀY QUAN TRỌNG NHẤT.** Aggregation Pipeline là kỹ năng MongoDB nâng cao nhất trong bài thi. Phải viết ít nhất 3 pipeline khác nhau để chứng minh thành thạo.

---

### 📌 Ngày 7 (25/03) — $graphLookup + Testing Backend ⭐⭐⭐
**Mục tiêu:** Dùng `$graphLookup` truy vấn đồ thị, test toàn bộ API bằng Postman

| Việc | File | Chi tiết |
|---|---|---|
| Graph API | `GET /api/stats/graph` | `$graphLookup` trên collection `links` → trả danh sách nodes + edges |
| Graph Data Format | — | Trả về `{ nodes: [{id, title}], edges: [{source, target}] }` |
| Postman Collection | — | Tạo folder Postman test tất cả endpoints |
| Error Handling | Toàn bộ controllers | Kiểm tra try/catch, status code chuẩn |

**Kỹ năng MongoDB:** `$graphLookup` (Tuyệt chiêu cuối — rất ít sinh viên biết dùng cái này!)

---

## TUẦN 2: ĐẤU NỐI FRONTEND ↔ BACKEND
> *Mục tiêu: Giao diện React hiển thị dữ liệu thật từ MongoDB*

---

### 📌 Ngày 8 (26/03) — Axios Setup + Auth Flow
**Mục tiêu:** Login/Register hoạt động thật, có JWT bảo vệ route

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Cài Axios | `npm install axios` | — |
| API Client | `src/services/api.ts` | Base URL, Interceptor gắn JWT Token tự động |
| Auth Service | `src/services/auth.service.ts` | `login()`, `register()`, `logout()` |
| Login Page | [pages/Login/Login.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Login/Login.tsx) | Gọi API thật, lưu Token vào localStorage |
| Protected Route | `components/layout/ProtectedRoute.tsx` | Chặn vào Dashboard nếu chưa login |

---

### 📌 Ngày 9 (27/03) — Explorer + CRUD Thật
**Mục tiêu:** Trang Explorer hiển thị danh sách Note từ MongoDB, có phân trang

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Note Service | `src/services/note.service.ts` | `getNotes()`, `createNote()`, `updateNote()`, `deleteNote()` |
| Explorer Page | [pages/Explorer/Explorer.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Explorer/Explorer.tsx) | Gọi API → render bảng/grid → xóa Note |
| Pagination | Explorer | Nút "Trang trước / Trang sau" gọi API `?page=N` |

---

### 📌 Ngày 10 (28/03) — Editor Hoạt Động Thật
**Mục tiêu:** Tạo/Sửa Note bằng Editor, lưu vào MongoDB

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Cài Editor | `npm install @uiw/react-md-editor` | Markdown editor đơn giản, nhẹ |
| Editor Page | [pages/Editor/Editor.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Editor/Editor.tsx) | Load Note → hiển thị trong Editor → Save |
| Create Flow | Editor | Nút "Save note" → `POST /api/notes` |
| Edit Flow | Editor | URL `/editor/:id` → `GET` note → `PUT` khi save |

---

### 📌 Ngày 11 (29/03) — Search + Dashboard
**Mục tiêu:** Tìm kiếm Full-text và Dashboard thống kê chạy dữ liệu thật

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Search Page | [pages/Search/Search.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Search/Search.tsx) | Gọi `GET /api/search?q=...` → hiển thị kết quả |
| Stats Service | `src/services/stats.service.ts` | `getDashboardStats()` |
| Dashboard Page | [pages/Dashboard/Dashboard.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Dashboard/Dashboard.tsx) | Thay số ảo bằng data thật từ Aggregation API |

---

### 📌 Ngày 12 (30/03) — Graph View + Backlinks
**Mục tiêu:** Trang Graph hiển thị mạng lưới Note (Visual WOW factor)

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Cài thư viện | `npm install react-force-graph-2d` | Vẽ đồ thị 2D |
| Graph Page | [pages/GraphView/GraphView.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/GraphView/GraphView.tsx) | Gọi `GET /api/stats/graph` → render nodes + edges |
| Backlinks | [pages/Editor/Editor.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Editor/Editor.tsx) | Gọi `GET /api/notes/:id/backlinks` → hiển thị danh sách |

---

### 📌 Ngày 13 (31/03) — Settings + Admin + Polish
**Mục tiêu:** Các trang phụ hoạt động, dọn bug

| Việc | File (Frontend) | Chi tiết |
|---|---|---|
| Settings | [pages/Settings/Settings.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Settings/Settings.tsx) | Update profile → `PUT /api/auth/profile` |
| Admin | [pages/Admin/Admin.tsx](file:///d:/Code/MongoDB/Project/Website_PKG/Frontend/src/pages/Admin/Admin.tsx) | Hiển thị stats tổng hệ thống (nếu role = admin) |
| Bug sweep | Toàn bộ | Rà soát lỗi console, fix edge case |
| Loading states | Components | Thêm skeleton/spinner khi đang gọi API |

---

### 📌 Ngày 14 (01/04) — Review + Slide Thuyết Trình
**Mục tiêu:** Hoàn thiện, chuẩn bị bài trình bày

| Việc | Chi tiết |
|---|---|
| Full test | Chạy lại toàn bộ flow: Register → Login → Create Note → Link → Search → Graph |
| Slide | Làm slide thuyết trình, chèn ảnh chụp màn hình + đoạn code MongoDB nổi bật |
| README.md | Viết README hướng dẫn cài đặt và chạy project |

> [!TIP]
> **Mẹo trình bày:** Trong slide, hãy chèn screenshot các đoạn Aggregation Pipeline và `$graphLookup` với comment tiếng Việt giải thích. Thầy cô sẽ đánh giá rất cao khi thấy sinh viên hiểu sâu và biết giải thích được.

---

## 🎯 CHECKLIST MONGODB FEATURES ĐỂ ĂN ĐIỂM

| Kỹ thuật MongoDB | Sử dụng ở đâu | Độ khó |
|---|---|---|
| CRUD cơ bản (`find`, `create`, `update`, `delete`) | Notes API | ⭐ |
| Unique Index | `users.email` | ⭐ |
| Compound Index | `notes: { userId, updatedAt }` | ⭐⭐ |
| Multikey Index (Index trên Array) | `notes.tags` | ⭐⭐ |
| Full-text Search Index (`$text`) | Search API | ⭐⭐⭐ |
| Aggregation `$group` + `$match` | Dashboard Stats | ⭐⭐⭐ |
| Aggregation `$unwind` | Top Tags thống kê | ⭐⭐⭐ |
| Aggregation `$dateToString` | Biểu đồ theo ngày | ⭐⭐⭐ |
| `$lookup` (JOIN trong NoSQL) | Backlinks API | ⭐⭐⭐ |
| `$graphLookup` (Đệ quy Graph) | Graph View API | ⭐⭐⭐⭐⭐ |
| `populate()` (Mongoose) | Lấy thông tin Note từ Link | ⭐⭐ |
| Schema Validation | Mongoose Schema + express-validator | ⭐⭐ |
| Embedding vs Referencing | Tags (embed) vs Links (reference) | ⭐⭐⭐ |

> [!IMPORTANT]
> **13/13 kỹ thuật** trong bảng trên đều sẽ được sử dụng trong dự án. Đây là bộ sưu tập MongoDB features đầy đủ nhất có thể cho một bài tập lớn cấp đại học.

---

## 🚀 SAU KHI NỘP BÀI (Kế hoạch mở rộng tương lai)

Sau khi qua kỳ thi, Sếp hoàn toàn có thể nâng cấp dự án để đưa vào CV xin việc:

1. **Tích hợp AI (RAG):** Chat với ghi chú bằng Gemini/OpenAI API
2. **Real-time Collaboration:** Nhiều người cùng edit Note (Socket.io)
3. **Offline-First:** Lưu tạm vào IndexedDB, sync khi có mạng
4. **Docker + Deploy:** Đóng gói ứng dụng, deploy lên VPS/Cloud
5. **Rich Text Editor:** Nâng cấp lên Tiptap/Lexical với Slash commands
