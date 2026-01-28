import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  credit: number;
};

const validate = z.object({
  name: z.string().min(3, "Name 3 ky tu").max(100),
  credit: z.number().min(1).max(100),
});

function AddPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(validate) });

  useEffect(() => {
    const getDetail = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const { data } = await axios.get(`/api/subject/${id}`, { headers });
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
          <label htmlFor="selectOption" className="block font-medium mb-1">
            Select - option
          </label>
          <select
            id="selectOption"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>

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
