import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Subject } from "../types/Subject";

const List = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [teacherFilter, setTeacherFilter] = useState<string>("Tất cả");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const teachers = ["Tất cả", ...Array.from(new Set(subjects.map((s) => s.teacher)))];

  useEffect(() => {
   
    const getAll = async () => {
      try {
       
        const response = await fetch("http://localhost:3000/subject");
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (error) {
        
          console.error("Error fetching subjects:", error);
        }
      
    };
    getAll();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, teacherFilter]);
  const term = searchTerm.trim().toLowerCase();
  const filtered = subjects.filter(
    (s) =>
      (!term || s.name.toLowerCase().includes(term)) &&
      (teacherFilter === "Tất cả" || s.teacher === teacherFilter)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);
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


      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.length === 0 ? (
            <tr>
              <td className="border p-2 text-center" colSpan={3}>
                Không có dữ liệu phù hợp
              </td>
            </tr>
          ) : (
            pageItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.id}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">
                  <Link to={`/edit/${item.id}`} className="text-blue-600 hover:underline">
                    Sửa
                  </Link>
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
