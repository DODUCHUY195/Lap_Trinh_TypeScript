import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  type FormData = {
    name: string;
    credit: number;
    category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
    teacher: string;
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      credit: 1,
      category: "Chuyên ngành",
      teacher: "",
    },
  });

  useEffect(() => {
    const fetchOne = async () => {
        const res = await fetch(`/api/subjects/${id}`);
        const data: FormData = await res.json();
        reset(data);
    };
    if (id) fetchOne();
  }, [id, reset]);

  const onSubmit = async (values: FormData) => {
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = Array.isArray(data?.errors) && data.errors.length ? data.errors.join("; ") : "Sửa thất bại";
        toast.error(msg);
        return;
      }
      await res.json();
      toast.success("Sửa thành công");
      navigate("/");
    } catch {
      toast.error("Có lỗi xảy ra khi sửa");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sửa môn học</h1>
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
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
      </form>
    </div>
  );
};

export default Edit;
