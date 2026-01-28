import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  isLogin?: boolean;
};

type FormValues = {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

function AuthPage({ isLogin }: Props) {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        const { data } = await axios.post("http://localhost:3000/login", {
          email: values.email,
          password: values.password,
        });
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        nav("/list");
      } else {
        await axios.post("http://localhost:3000/register", {
          username: values.username,
          email: values.email,
          password: values.password,
        });
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              {...register("username", {
                required: "Bắt buộc",
                minLength: { value: 5, message: "Phải > 4 ký tự" },
              })}
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>
        )}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            {...register("email", {
              required: "Bắt buộc",
              pattern: {
                value:
                  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Email không hợp lệ",
              },
            })}
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            {...register("password", {
              required: "Bắt buộc",
              minLength: { value: 7, message: "Phải > 6 ký tự" },
            })}
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-600 mt-1">{errors.password.message}</p>
          )}
        </div>
        {!isLogin && (
          <div>
            <label className="block font-medium mb-1">Confirm Password</label>
            <input
              {...register("confirmPassword", {
                required: "Bắt buộc",
                validate: (v) =>
                  v === watch("password") || "Không khớp password",
              })}
              type="password"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}
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
