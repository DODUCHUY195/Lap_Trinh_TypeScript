// Import hook React để quản lý state và life-cycle
import { useEffect, useState } from "react";
// Import axios để gọi HTTP API
import axios from "axios";
// Import Link để điều hướng tới trang sửa
import { Link } from "react-router-dom";

// Khai báo kiểu dữ liệu Subject (một dòng trong danh sách)
type Subject = {
  // Khóa chính
  id: number;
  // Tên môn học
  name: string;
  // Số tín chỉ
  credit: number;
  // Loại môn học
  category: string;
  // Giáo viên phụ trách
  teacher: string;
};

function ListSimple() {
  
  // Danh sách môn học hiển thị trong bảng
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Từ khóa tìm kiếm theo tên
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Giáo viên lọc (mặc định "Tất cả")
  const [teacherFilter, setTeacherFilter] = useState<string>("Tất cả");
  // Trang hiện tại
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Số item mỗi trang
  const itemsPerPage = 5;
  // Danh sách giáo viên cho combobox
  const [teachers, setTeachers] = useState<string[]>(["Tất cả"]);
  // Tổng số trang (tính từ X-Total-Count header)
  const [totalPages, setTotalPages] = useState<number>(1);

  // Lần đầu vào trang: tải danh sách giáo viên
  useEffect(() => {
    const getTeachers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const res = await axios.get<Subject[]>("http://localhost:3000/subjects?_page=1&_limit=1000", { headers });
        const unique = Array.from(new Set(res.data.map((s) => s.teacher))).filter(Boolean);
        setTeachers(["Tất cả", ...unique]);
      } catch (error) {
        // Log lỗi đơn giản
        console.log(error);
      }
    };
    getTeachers();
  }, []);

  // Khi thay đổi từ khóa hoặc giáo viên → reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, teacherFilter]);

  // Mỗi khi search/filter/page thay đổi → gọi API danh sách
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
        const res = await axios.get<Subject[]>(`http://localhost:3000/subjects?${params.toString()}`, { headers });
        const total = Number(res.headers["x-total-count"] ?? res.headers["X-Total-Count"] ?? "0");
        setSubjects(res.data);
        setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
      } catch (error) {
        console.log(error);
      }
    };
    loadSubjects();
  }, [searchTerm, teacherFilter, currentPage]);
  // Đảm bảo trang hiện tại không vượt quá tổng trang
  const page = Math.min(currentPage, totalPages);
  // Tạo mảng số trang [1..totalPages] để render nút
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="p-6">
      {/* Tiêu đề trang */}
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

      {/* Khu vực tìm kiếm và lọc giáo viên */}
      <div className="flex items-center gap-4 mb-4">
        <input
          // Dữ liệu nhập tìm kiếm
          value={searchTerm}
          // Cập nhật từ khóa
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên môn học"
          className="border rounded px-3 py-2 w-64"
        />
        <select
          // Giá trị giáo viên đang lọc
          value={teacherFilter}
          // Cập nhật giáo viên chọn
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {/* Render danh sách giáo viên */}
          {teachers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          className="px-3 py-2 border rounded"
          onClick={() => {
            // Tải lại danh sách thủ công
            const run = async () => {
              try {
                const params = new URLSearchParams();
                if (searchTerm.trim()) params.set("name_like", searchTerm.trim());
                if (teacherFilter && teacherFilter !== "Tất cả") params.set("teacher", teacherFilter);
                params.set("_page", String(currentPage));
                params.set("_limit", String(itemsPerPage));
                const token = localStorage.getItem("accessToken");
                const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
                const res = await axios.get<Subject[]>(`/api/subjects?${params.toString()}`, { headers });
                const total = Number(res.headers["x-total-count"] ?? res.headers["X-Total-Count"] ?? "0");
                setSubjects(res.data);
                setTotalPages(Math.max(1, Math.ceil(total / itemsPerPage)));
              } catch (error) {
                console.log(error);
              }
            };
            run();
          }}
        >
          Tải lại
        </button>
      </div>

      {/* Bảng danh sách môn học */}
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
            {/* Duyệt danh sách và render từng dòng */}
            {subjects.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.teacher}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {/* Nút đi tới trang sửa */}
                  <Link to={`/edit/${item.id}`}>Edit</Link>
                  {/* Nút xóa — có confirm trước khi gọi API */}
                  <button
                    className="ml-3 text-red-600"
                    onClick={async () => {
                      // Xác nhận xóa
                      const ok = window.confirm(`Xóa ID ${item.id}?`);
                      if (!ok) return;
                      try {
                        // Gọi API xóa
                        const token = localStorage.getItem("accessToken");
                        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
                        await axios.delete(`http://localhost:3000/subjects/${item.id}`, { headers });
                        // Xóa khỏi state để cập nhật UI
                        setSubjects((prev) => prev.filter((s) => s.id !== item.id));
                      } catch (error) {
                        // Log lỗi đơn giản
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
      {/* Khu vực phân trang */}
      <div className="flex items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          // Về trang trước (không nhỏ hơn 1)
          disabled={page === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        {/* Render các nút số trang */}
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
          // Tới trang sau (không lớn hơn tổng trang)
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
