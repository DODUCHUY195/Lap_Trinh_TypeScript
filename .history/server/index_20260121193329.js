import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: true,
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.json());

const dbPath = path.join(__dirname, "..", "db.json");
function loadData() {
  const raw = fs.readFileSync(dbPath, "utf-8");
  const json = JSON.parse(raw);
  const subjects = Array.isArray(json.subject) ? json.subject : [];
  return subjects;
}

app.get("/api/teachers", (req, res) => {
  const subjects = loadData();
  const unique = Array.from(new Set(subjects.map((s) => s.teacher))).filter(Boolean);
  res.json(["Tất cả", ...unique]);
});

app.get("/api/subjects", (req, res) => {
  const subjects = loadData();
  const q = (req.query.q || "").toString().trim().toLowerCase();
  const teacher = (req.query.teacher || "").toString().trim();
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit || "5", 10));

  let filtered = subjects.filter((s) => {
    const nameOk = !q || (s.name || "").toLowerCase().includes(q);
    const teacherOk = !teacher || teacher === "Tất cả" || s.teacher === teacher;
    return nameOk && teacherOk;
  });

  const totalCount = filtered.length;
  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  res.set("X-Total-Count", String(totalCount));
  res.set("Access-Control-Expose-Headers", "X-Total-Count");
  res.json(pageItems);
});

app.get("/api/subjects/:id", (req, res) => {
  const subjects = loadData();
  const id = parseInt(String(req.params.id), 10);
  const found = subjects.find((s) => s.id === id);
  if (!found) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(found);
});

app.post("/api/subjects", (req, res) => {
  try {
    const subjects = loadData();
    const { name, credit, category, teacher } = req.body || {};
    const errors = [];
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
    const nextId = subjects.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
    const newItem = {
      id: nextId,
      name: String(name).trim(),
      credit: numCredit,
      category,
      teacher: String(teacher).trim(),
    };
    const dbRaw = fs.readFileSync(dbPath, "utf-8");
    const dbJson = JSON.parse(dbRaw);
    const list = Array.isArray(dbJson.subject) ? dbJson.subject : [];
    list.push(newItem);
    dbJson.subject = list;
    fs.writeFileSync(dbPath, JSON.stringify(dbJson, null, 2), "utf-8");
    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`);
});
