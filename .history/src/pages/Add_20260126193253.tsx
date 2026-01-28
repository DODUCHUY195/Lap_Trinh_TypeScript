import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";

type FormData = {
  name: string;
  credit: number;
  category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
  teacher: string;
};

function AddPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: "ReactJS Cơ Bản",
      credit: 3,
      category: "Chuyên ngành",
      teacher: "Nguyễn Văn A",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await axios.post("/api/subjects", values);
      toast.success("Thêm thành công");
      navigate("/");
    } catch {
      toast.error("Thêm thất bại");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên môn học
          </label>
          <input
            id="name"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("name", { required: "Bắt buộc", minLength: { value: 4, message: "Tên phải > 3 ký tự" } })}
          />
          {errors.name && <p className="text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Số tín chỉ
          </label>
          <input
            id="credit"
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("credit", {
              valueAsNumber: true,
              required: "Bắt buộc",
              validate: (v) => (v > 0 ? true : "Số tín chỉ phải > 0"),
            })}
          />
          {errors.credit && <p className="text-red-600 mt-1">{errors.credit.message}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại môn học
          </label>
          <select
            id="category"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("category", { required: "Bắt buộc" })}
          >
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          {errors.category && <p className="text-red-600 mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên
          </label>
          <input
            id="teacher"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("teacher", { required: "Bắt buộc", minLength: { value: 4, message: "Giáo viên phải > 3 ký tự" } })}
          />
          {errors.teacher && <p className="text-red-600 mt-1">{errors.teacher.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Đang thêm..." : "Thêm"}
        </button>
      </form>
    </div>
  );
}

export default AddPage;
