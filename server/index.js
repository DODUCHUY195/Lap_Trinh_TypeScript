// Import thư viện cần thiết cho server Express
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Xác định đường dẫn file hiện tại trong môi trường ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Khởi tạo ứng dụng Express
const app = express();
// Bật CORS cho frontend, expose header tổng số bản ghi
app.use(
  cors({
    origin: true,
    exposedHeaders: ["X-Total-Count"],
  })
);
// Cho phép parse JSON body từ client
app.use(express.json());

// Đường dẫn tới db.json và hàm đọc dữ liệu
const dbPath = path.join(__dirname, "..", "db.json");
function loadData() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  const json = JSON.parse(raw);
  const subjects = Array.isArray(json.subject) ? json.subject : [];
  return subjects;
}

// API lấy danh sách giáo viên duy nhất (thêm "Tất cả" ở đầu)
app.get("/api/teachers", (req, res) => {
  const subjects = loadData();
  const unique = Array.from(new Set(subjects.map((s) => s.teacher))).filter(Boolean);
  res.json(["Tất cả", ...unique]);
});

// API danh sách môn học: hỗ trợ tìm kiếm theo tên, lọc giáo viên và phân trang
app.get("/api/subjects", (req, res) => {
  const subjects = loadData();
  // Lấy tham số query: q (tìm tên), teacher (lọc), page/limit (phân trang)
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const teacher = (req.query.teacher || "").toString().trim();
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit || "5", 10));

  // Lọc theo tên và giáo viên
  let filtered = subjects.filter((s) => {
    const nameOk = !q || (s.name || "").toLowerCase().includes(q);
    const teacherOk = !teacher || teacher === "Tất cả" || s.teacher === teacher;
    return nameOk && teacherOk;
  });

  // Tính tổng số bản ghi và cắt theo trang
  const totalCount = filtered.length;
  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  // Gửi tổng số bản ghi qua header để frontend tính tổng trang
  res.set("X-Total-Count", String(totalCount));
  res.set("Access-Control-Expose-Headers", "X-Total-Count");
  res.json(pageItems);
});

// API lấy chi tiết một môn theo id
app.get("/api/subjects/:id", (req, res) => {
  const subjects = loadData();
  const id = parseInt(String(req.params.id), 10);
  const found = subjects.find((s) => s.id === id);
  if (!found) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(found);
});

// API thêm mới môn học: validate input và ghi vào db.json
app.post("/api/subjects", (req, res) => {
  try {
    const subjects = loadData();
    const { name, credit, category, teacher } = req.body || {};
    const errors = [];
    // Kiểm tra tên > 3 ký tự
    if (!name || typeof name !== "string" || name.trim().length <= 3) {
      errors.push("name phải là chuỗi và > 3 ký tự");
    }
    // Kiểm tra số tín chỉ > 0
    const numCredit = Number(credit);
    if (!Number.isFinite(numCredit) || numCredit <= 0) {
      errors.push("credit phải là số > 0");
    }
    // Kiểm tra category hợp lệ
    const categories = ["Cơ sở", "Chuyên ngành", "Đại cương"];
    if (!category || !categories.includes(category)) {
      errors.push("category không hợp lệ");
    }
    // Kiểm tra teacher > 3 ký tự
    if (!teacher || typeof teacher !== "string" || teacher.trim().length <= 3) {
      errors.push("teacher phải là chuỗi và > 3 ký tự");
    }
    // Nếu có lỗi, trả 400
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    // Tạo id mới và object mới
    const nextId = subjects.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
    const newItem = {
      id: nextId,
      name: String(name).trim(),
      credit: numCredit,
      category,
      teacher: String(teacher).trim(),
    };
    // Đọc db.json, chèn item mới và ghi lại
    const dbRaw = fs.readFileSync(dbPath, "utf-8");
    const dbJson = JSON.parse(dbRaw);
    const list = Array.isArray(dbJson.subject) ? dbJson.subject : [];
    list.push(newItem);
    dbJson.subject = list;
    fs.writeFileSync(dbPath, JSON.stringify(dbJson, null, 2), "utf-8");
    // Trả 201 + item mới
    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

// API cập nhật môn học theo id: validate rồi ghi lại db.json
app.put("/api/subjects/:id", (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const raw = fs.readFileSync(dbPath, "utf-8");
    const dbJson = JSON.parse(raw);
    const list = Array.isArray(dbJson.subject) ? dbJson.subject : [];
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
    const { name, credit, category, teacher } = req.body || {};
    const errors = [];
    // Validate tương tự POST
    if (!name || typeof name !== "string" || name.trim().length <= 3) {
      errors.push("name phải là chuỗi và > 3 ký tự");
    }
    const numCredit = Number(credit);
    if (!Number.isFinite(numCredit) || numCredit <= 0) {
      errors.push("credit phải là số > 0");
    }
    const categories = ["Cơ sở", "Chuyên ngành", "Đại cương"];
    if (!category || !categories.includes(category)) {
      errors.push("category không hợp lệ");
    }
    if (!teacher || typeof teacher !== "string" || teacher.trim().length <= 3) {
      errors.push("teacher phải là chuỗi và > 3 ký tự");
    }
    if (errors.length) {
      return res.status(400).json({ errors });
    }
    // Ghi đè lại phần tử với dữ liệu mới
    const updated = {
      id,
      name: String(name).trim(),
      credit: numCredit,
      category,
      teacher: String(teacher).trim(),
    };
    list[index] = updated;
    dbJson.subject = list;
    fs.writeFileSync(dbPath, JSON.stringify(dbJson, null, 2), "utf-8");
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

// API xóa môn học theo id: xóa khỏi mảng và ghi lại db.json
app.delete("/api/subjects/:id", (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    const raw = fs.readFileSync(dbPath, "utf-8");
    const dbJson = JSON.parse(raw);
    const list = Array.isArray(dbJson.subject) ? dbJson.subject : [];
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
    list.splice(index, 1);
    dbJson.subject = list;
    fs.writeFileSync(dbPath, JSON.stringify(dbJson, null, 2), "utf-8");
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

// Khởi động server tại cổng PORT (mặc định 4000)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`);
});
