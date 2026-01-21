import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
    formState: { isSubmitting },
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
      const res = await fetch("http://localhost:4000/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) return;
      await res.json();
      toast.success("Thêm thành công");
      navigate("/");
    } catch (e) {
      // Bỏ hiển thị lỗi theo yêu cầu
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
            {...register("name")}
          />
        </div>

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
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại môn học
          </label>
          <select
            id="category"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("category")}
          >
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Đại cương">Đại cương</option>
          </select>
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên
          </label>
          <input
            id="teacher"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("teacher")}
          />
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
