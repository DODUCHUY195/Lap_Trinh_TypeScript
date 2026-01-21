import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Subject } from "../types/Subject";

const List = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAll = async () => {
      try {
        const res = await fetch("http://localhost:8000/subjects");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const list: Subject[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.subjects)
          ? raw.subjects
          : [];
        setSubjects(list);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Fetch failed");
        setSubjects([]);
      }
    };
    getAll();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách</h1>

      {error && <div className="mb-3 text-red-600">Lỗi: {error}</div>}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">
                <Link to={`/edit/${item.id}`} className="text-blue-600 hover:underline">
                  Sửa
                </Link>
              </td>
            </tr>
          ))}
          {subjects.length === 0 && !error && (
            <tr>
              <td className="border p-2 text-center" colSpan={3}>
                Chưa có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;