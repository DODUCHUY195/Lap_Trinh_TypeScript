import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

type Subject = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function EditSimple() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Omit<Subject, "id">>({
    name: "",
    credit: 1,
    category: "Chuyên ngành",
    teacher: "",
  });

  useEffect(() => {
    const getOne = async () => {
      try {
        const { data } = await axios.get<Subject>(`/api/subjects/${id}`);
        setForm({
          name: data.name,
          credit: data.credit,
          category: data.category,
          teacher: data.teacher,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (id) getOne();
  }, [id]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/subjects/${id}`, form);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Sửa môn học</h1>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="block font-medium mb-1">Tên môn học</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Số tín chỉ</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2"
            value={form.credit}
            onChange={(e) => setForm((p) => ({ ...p, credit: Number(e.target.value) }))}
          />
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
        </div>
        <div>
          <label className="block font-medium mb-1">Giáo viên</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            value={form.teacher}
            onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))}
          />
        </div>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
      </form>
    </div>
  );
}

export default EditSimple;
