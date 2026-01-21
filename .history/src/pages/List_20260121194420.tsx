import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Subject } from "../types/Subject";

const List = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/subjects?page=1&limit=1000");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Subject[] = await res.json();
        setSubjects(data);
      } catch (e) {
        setError((e as Error).message || "Không thể tải danh sách");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [searchTerm, teacherFilter]);

  // useEffect(() => {
  //   const fetchSubjects = async () => {
  //     try {
  //       const params = new URLSearchParams();
  //       if (searchTerm.trim()) params.set("q", searchTerm.trim());
  //       if (teacherFilter && teacherFilter !== "Tất cả") params.set("teacher", teacherFilter);
  //       params.set("page", String(currentPage));
  //       params.set("limit", String(itemsPerPage));
  //       const url = `http://localhost:4000/api/subjects?${params.toString()}`;
  //       const res = await fetch(url);
  //       const data: Subject[] = await res.json();
  //       const total = Number(res.headers.get("X-Total-Count") || "0");
  //       setSubjects(data);
  //       setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
  //     } catch (error) {
  //       console.error("Error fetching subjects:", error);
  //     }
  //   };
  //   fetchSubjects();
  // }, [searchTerm, teacherFilter, currentPage]);
  // const page = Math.min(currentPage, totalPages);
  // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
            <th className="border p-2">Giáo viên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length === 0 ? (
            <tr>
              <td className="border p-2 text-center" colSpan={4}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            subjects.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.teacher}</td>
                <td className="border p-2">
                  <Link to={`/edit/${item.id}`} className="text-blue-600 hover:underline">
                    Sửa
                  </Link>
                  <button
                    className="ml-3 text-red-600 hover:underline"
                    onClick={async () => {
                      try {
                        await fetch(`/api/subjects/${item.id}`, { method: "DELETE" });
                      
                        setSubjects((prev) => prev.filter((s) => s.id !== item.id));
                        toast.success("Xóa thành công");
                      } catch {
                        toast.error("Xóa thất bại");
                      }
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default List;
