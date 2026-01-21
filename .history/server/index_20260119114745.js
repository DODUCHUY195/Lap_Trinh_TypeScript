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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Node server running at http://localhost:${PORT}`);
});
