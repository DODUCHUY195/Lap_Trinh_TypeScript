import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  isLogin?: boolean;
};

type FormValues = {
  email: string;
  password: string;
};
// zod validate schema {}
function AuthPage({ isLogin }: Props) {
  const nav = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        // login
        const { data } = await axios.post(
          "http://localhost:3000/login",
          values,
        );
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        nav("/list");
      } else {
        // register
        await axios.post("http://localhost:3000/register", values);
        toast.success("Đăng ký thành công");
        nav("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <h1 className="text-3xl">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

export default AuthPage;