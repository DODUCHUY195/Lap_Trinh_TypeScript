import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

type FormData = {
  name: string;
  credit: number;
  category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
  teacher: string;
};

function AddPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    name: "ReactJS Cơ Bản",
    credit: 3,
    category: "Chuyên ngành",
    teacher: "Nguyễn Văn A",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    const nextErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name || form.name.trim().length <= 3) nextErrors.name = "Tên phải > 3 ký tự";
    if (!Number.isFinite(form.credit) || form.credit <= 0) nextErrors.credit = "Số tín chỉ phải > 0";
    if (!form.category || !["Cơ sở", "Chuyên ngành", "Đại cương"].includes(form.category))
      nextErrors.category = "Loại môn học không hợp lệ";
    if (!form.teacher || form.teacher.trim().length <= 3) nextErrors.teacher = "Giáo viên phải > 3 ký tự";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:4000/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          Array.isArray(data?.errors) && data.errors.length
            ? data.errors.join("; ")
            : "Thêm thất bại";
        toast.error(msg);
        return;
      }
      await res.json();
      toast.success("Thêm thành công");
      navigate("/");
    } catch (e) {
      toast.error("Có lỗi xảy ra khi thêm");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Tên môn học
          </label>
          <input
            id="name"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          {errors.name && (
            <p className="text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Số tín chỉ
          </label>
          <input
            id="credit"
            type="number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.credit}
            onChange={(e) => setForm((f) => ({ ...f, credit: Number(e.target.value) }))}
          />
          {errors.credit && (
            <p className="text-red-600 mt-1">{errors.credit}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Loại môn học
          </label>
          <select
            id="category"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as FormData["category"] }))}
          >
            <option value="Cơ sở">Cơ sở</option>
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          {errors.category && (
            <p className="text-red-600 mt-1">{errors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giáo viên
          </label>
          <input
            id="teacher"
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.teacher}
            onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))}
          />
          {errors.teacher && (
            <p className="text-red-600 mt-1">{errors.teacher}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? "Đang thêm..." : "Thêm"}
        </button>
      </form>
    </div>
  );
}

export default AddPage;
