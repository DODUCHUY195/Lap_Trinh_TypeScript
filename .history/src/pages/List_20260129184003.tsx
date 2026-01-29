import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Subject = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListSimple() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teacherFilter, setTeacherFilter] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [teachers, setTeachers] = useState<string[]>(["Tất cả"]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const getTeachers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await axios.get<Subject[]>("http://localhost:3000/subject?_page=1&_limit=1000", { headers });
        const unique = Array.from(new Set(res.data.map((s) => s.teacher))).filter(Boolean);
        setTeachers(["Tất cả", ...unique]);
      } catch (error) {
        console.log(error);
      }
    };
    getTeachers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, teacherFilter]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.set("name_like", searchTerm.trim());
        if (teacherFilter && teacherFilter !== "Tất cả") params.set("teacher", teacherFilter);
        params.set("_page", String(currentPage));
        params.set("_limit", String(itemsPerPage));
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await axios.get<Subject[]>(`http://localhost:3000/subject?${params.toString()}`, { headers });
        const total = Number(res.headers["x-total-count"] ?? res.headers["X-Total-Count"] ?? "0");
        setSubjects(res.data);
        setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
      } catch (error) {
        console.log(error);
      }
    };
    loadSubjects();
  }, [searchTerm, teacherFilter, currentPage]);
  const page = Math.min(currentPage, totalPages);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

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

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Teacher</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.teacher}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <Link to={`/edit/${item.id}`}>Edit</Link>
                  <button
                    className="ml-3 text-red-600"
                    onClick={async () => {
                      const ok = window.confirm(`Xóa ID ${item.id}?`);
                      if (!ok) return;
                      try {
                        const token = localStorage.getItem("accessToken");
                        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
                        await axios.delete(`http://localhost:3000/subject/${item.id}`, { headers });
                        setSubjects((prev) => prev.filter((s) => s.id !== item.id));
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
}

export default ListSimple;
