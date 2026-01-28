import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Kiểu dữ liệu Subject đại diện cho một môn học trong hệ thống
type Subject = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function EditSimple() {
  // Hook điều hướng sau khi lưu xong
  const navigate = useNavigate();
  // Lấy id từ URL (/edit-simple/:id)
  const { id } = useParams<{ id: string }>();
  // State form điều khiển (controlled form) cho 4 trường, mặc định giá trị khởi tạo
  const [form, setForm] = useState<Omit<Subject, "id">>({
    name: "",
    credit: 1,
    category: "Chuyên ngành",
    teacher: "",
  });
  // State lưu lỗi hiển thị theo từng trường khi validate thất bại
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Subject, "id">, string>>>({});

  useEffect(() => {
    // Tải dữ liệu 1 môn học theo id để điền vào form
    const getOne = async () => {
      try {
        // Gọi API lấy chi tiết môn học
        const { data } = await axios.get<Subject>(`/api/subjects/${id}`);
        // Điền dữ liệu vào form
        setForm({
          name: data.name,
          credit: data.credit,
          category: data.category,
          teacher: data.teacher,
        });
      } catch (error) {
        // Log lỗi đơn giản (có thể thay bằng toast nếu cần)
        console.log(error);
      }
    };
    if (id) getOne();
  }, [id]);

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof Omit<Subject, "id">, string>> = {};
    const name = form.name.trim();
    const teacher = form.teacher.trim();
    // Kiểm tra tên: bắt buộc > 3 ký tự
    if (name.length <= 3) nextErrors.name = "Tên phải > 3 ký tự";
    // Kiểm tra tín chỉ: là số và > 0
    if (!Number.isFinite(form.credit) || form.credit <= 0) nextErrors.credit = "Số tín chỉ phải > 0";
    // Kiểm tra loại môn học: thuộc tập giá trị cho phép
    if (!["Cơ sở", "Chuyên ngành", "Đại cương"].includes(form.category))
      nextErrors.category = "Loại môn học không hợp lệ";
    // Kiểm tra giáo viên: bắt buộc > 3 ký tự
    if (teacher.length <= 3) nextErrors.teacher = "Giáo viên phải > 3 ký tự";
    // Cập nhật state lỗi để hiển thị dưới từng trường
    setErrors(nextErrors);
    // Trả về true nếu không có lỗi nào
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await axios.put(`/api/subjects/${id}`, form);
      // Chuyển hướng về trang danh sách sau khi lưu thành công
      navigate("/");
    } catch (error) {
      // Log lỗi (có thể thay bằng toast nếu muốn)
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      {/* Tiêu đề trang sửa */}
      <h1 className="text-2xl font-semibold mb-6">Sửa môn học</h1>
      {/* Form điều khiển có các trường: name, credit, category, teacher */}
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="block font-medium mb-1">Tên môn học</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          {errors.name && <p className="text-red-600 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Số tín chỉ</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.credit}
            onChange={(e) => setForm((p) => ({ ...p, credit: Number(e.target.value) }))}
          />
          {errors.credit && <p className="text-red-600 mt-1">{errors.credit}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Loại môn học</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          {errors.category && <p className="text-red-600 mt-1">{errors.category}</p>}
        </div>
        <div>
          <label className="block font-medium mb-1">Giáo viên</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.teacher}
            onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))}
          />
          {errors.teacher && <p className="text-red-600 mt-1">{errors.teacher}</p>}
        </div>
        {/* Nút lưu thay đổi */}
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
      </form>
    </div>
  );
}

export default EditSimple;
