import axios from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type FormValues = {
  name: string;
  credit: number;
  category: "Cơ sở" | "Chuyên ngành" | "Đại cương";
  teacher: string;
};

const validate = z.object({
  name: z.string().min(4, "Tên phải > 3 ký tự").max(100),
  credit: z.number().min(1, "Số tín chỉ phải > 0").max(100),
  category: z.enum(["Cơ sở", "Chuyên ngành", "Đại cương"]),
  teacher: z.string().min(4, "Giáo viên phải > 3 ký tự").max(100),
});

function EditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validate),
  });

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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
