import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Subject } from "../types/Subject";

const List = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const getAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:3000/subjects", { signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (error) {
        const message =
          error instanceof DOMException && error.name === "AbortError"
            ? null
            : (error as Error)?.message || "Không thể tải dữ liệu";
        if (message) {
          setError(message);
          console.error("Error fetching subjects:", error);
        }
      }
      finally {
        setLoading(false);
      }
    };
    getAll();
    return () => controller.abort();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách</h1>
      {loading && <p className="mb-2 text-gray-600">Đang tải dữ liệu...</p>}
      {error && <p className="mb-4 text-red-600">Lỗi: {error}</p>}

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
        </tbody>
      </table>
    </div>
  );
};

export default List;
