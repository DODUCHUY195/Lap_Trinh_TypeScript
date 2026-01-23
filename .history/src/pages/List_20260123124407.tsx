import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import type { Subject } from "../types/Subject";

const List = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teacherFilter, setTeacherFilter] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [teachers, setTeachers] = useState<string[]>(["Tất cả"]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/teachers");
        const list: string[] = await res.json();
        setTeachers(list);
      } catch (e) {
        setError((e as Error).message || "Không thể tải danh sách giáo viên");
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, teacherFilter]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("q", searchTerm.trim());
        if (teacherFilter && teacherFilter !== "Tất cả") params.set("teacher", teacherFilter);
        params.set("page", String(currentPage));
        params.set("limit", String(itemsPerPage));
        const res = await fetch(`/api/subjects?${params.toString()}`);
        const data: Subject[] = await res.json();
        const total = Number(res.headers.get("X-Total-Count") || "0");
        setSubjects(data);
        setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
      } catch {
        setError("Không thể tải danh sách môn học");
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [searchTerm, teacherFilter, currentPage]);
  const page = Math.min(currentPage, totalPages);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách</h1>
      <div className="flex items-center gap-4 mb-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên môn học"
          className="border rounded px-3 py-2 w-64"
        />
        <select
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {teachers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
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
                      const ok = window.confirm(`Bạn có chắc muốn xóa ID ${item.id}?`);
                      if (!ok) return;
                      try {
                        const res = await fetch(`/api/subjects/${item.id}`, { method: "DELETE" });
                        if (res.status !== 204 && !res.ok) throw new Error(`HTTP ${res.status}`);
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
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 border rounded ${p === page ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setCurrentPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default List;
