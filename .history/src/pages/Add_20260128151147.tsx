import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

// Trang Add: Thêm/Sửa môn học với 4 trường (name, credit, category, teacher)
// Sử dụng react-hook-form kết hợp zod để validate tập trung bằng schema
// Nếu có param id → tải chi tiết và reset form; nếu không → thêm mới

type FormValues = {
  name: string;
  credit: number;
  category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
  teacher: string;
};

// Schema zod: mô tả và kiểm tra tất cả field đầu vào của form
// - name: chuỗi, bắt buộc, > 3 ký tự
// - credit: số, bắt buộc, > 0
// - category: một trong 3 giá trị hợp lệ
// - teacher: chuỗi, bắt buộc, > 3 ký tự
const validate = z.object({
  name: z.string().min(4, "Tên phải > 3 ký tự").max(100),
  credit: z.number().min(1, "Số tín chỉ phải > 0").max(100),
  category: z.enum(["Cơ sở", "Chuyên ngành", "Đại cương"]),
  teacher: z.string().min(4, "Giáo viên phải > 3 ký tự").max(100),
});

function AddPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Khởi tạo form với zodResolver để lấy lỗi từ schema zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(validate) });

  // Tải dữ liệu chi tiết theo id (nếu đang ở chế độ sửa) và điền vào form
  useEffect(() => {
    const getDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");  //- Lấy chuỗi accessToken đã lưu trong trình duyệt từ bước đăng nhập (AuthPage), nơi token được set bằng localStorage.setItem("accessToken", data.accessToken).
                                                            //- Nếu chưa đăng nhập hoặc token hết hạn/không tồn tại, giá trị sẽ là null.
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined; //- Tạo cấu hình header cho request:
//- Khi có token, thêm trường Authorization dưới dạng Bearer token (chuẩn cho các API bảo vệ).
//- Khi không có token, để undefined để axios không gắn Authorization vào request (tránh gửi header trống gây lỗi).
//- Dùng điều kiện này giúp cùng một đoạn code chạy tốt với cả endpoint cần quyền (json-server-auth) và endpoint công khai.
        const { data } = await axios.get(`/api/subject/${id}`, { headers });
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) getDetail();
  }, [id, reset]);

  // Submit: nếu có id → PUT cập nhật; nếu không → POST thêm mới
  // Gửi kèm Authorization khi đang chạy json-server-auth
  const onSubmit = async (values: FormValues) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      if (id) {
        await axios.put(`/api/subject/${id}`, values, { headers });
      } else {
        await axios.post("/api/subject", values, { headers });
      }
      toast.success("Thành công");
      navigate("/");
    } catch (error) {
      toast.error("Thất bại: " + (error as AxiosError).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>
      {/* Form nhập liệu và hiển thị lỗi từng trường */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* name: chuỗi, > 3 ký tự */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên môn học
          </label>
          <input
            id="name"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name")}
          />
          {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* credit: số, > 0 (valueAsNumber để ép kiểu number) */}
        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Số tín chỉ
          </label>
          <input
            id="credit"
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("credit", { valueAsNumber: true })}
          />
          {errors.credit && <p className="text-red-600 mt-1">{errors.credit.message}</p>}
        </div>

        {/* category: chọn một trong 3 giá trị hợp lệ */}
        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại môn học
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
          {errors.category && <p className="text-red-600 mt-1">{errors.category.message}</p>}
        </div>

        {/* teacher: chuỗi, > 3 ký tự */}
        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên
          </label>
          <input
            {...register("teacher")}
            type="text"
            id="teacher"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.teacher && <p className="text-red-600 mt-1">{errors.teacher.message}</p>}
        </div>

        {/* Nút submit: gọi handleSubmit(onSubmit) để chạy validate + submit */}
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPage;
