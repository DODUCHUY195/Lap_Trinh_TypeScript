import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Trang Edit: Cập nhật môn học theo id trên URL
// Dùng react-hook-form + zod để validate tập trung
// Luồng: tải chi tiết → reset form → người dùng sửa → submit PUT

type FormValues = {
  name: string;
  credit: number;
  category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
  teacher: string;
};

// Schema zod cho form Edit
// - name: chuỗi, > 3 ký tự
// - credit: số, > 0
// - category: một trong 3 giá trị hợp lệ
// - teacher: chuỗi, > 3 ký tự
const validate = z.object({
  name: z.string().min(4, "Tên phải > 3 ký tự").max(100),
  credit: z.number().min(1, "Số tín chỉ phải > 0").max(100),
  category: z.enum(["Cơ sở", "Chuyên ngành", "Đại cương"]),
  teacher: z.string().min(4, "Giáo viên phải > 3 ký tự").max(100),
});

function EditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  // Khởi tạo form với zodResolver để lấy lỗi từ schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validate),
  });

  // Tải chi tiết môn học theo id và điền vào form
  useEffect(() => {
    const getDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const { data } = await axios.get(`http://localhost:3000/subject/${id}`, { headers });
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) getDetail();
  }, [id, reset]);

  // Submit PUT cập nhật dữ liệu theo id
  const onSubmit = async (values: FormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      await axios.put(`http://localhost:3000/subject/${id}`, values, { headers });
      nav("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Update</h1>
      {/* Form: name, credit, category, teacher; hiển thị lỗi từ errors */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* name */}
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Text
          </label>
          <input
            {...register("name")}
            type="text"
            id="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.name?.message as string}</span>
        </div>
        {/* credit */}
        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Credit
          </label>
          <input
            {...register("credit", { valueAsNumber: true })}
            type="number"
            id="credit"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.credit?.message as string}</span>
        </div>
        {/* category */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          <span>{errors?.category?.message as string}</span>
        </div>
        {/* teacher */}
        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Teacher
          </label>
          <input
            {...register("teacher")}
            type="text"
            id="teacher"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.teacher?.message as string}</span>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default EditPage;
