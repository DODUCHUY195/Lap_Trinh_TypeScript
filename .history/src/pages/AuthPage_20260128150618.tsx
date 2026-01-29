import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

// Trang Auth: Đăng nhập/Đăng ký
// Dùng zod để validate schema theo chế độ:
// - Login: email + password
// - Register: username + email + password + confirmPassword (phải khớp password)
// Sau khi đăng nhập thành công → lưu accessToken vào localStorage

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
  // Khởi tạo form; resolver chọn theo isLogin để áp dụng đúng schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // useMemo: tạo schema zod theo chế độ (Login/Register) và chỉ tái tạo khi isLogin thay đổi.
    // Lợi ích:
    // 1) Tránh tạo schema mới ở mỗi lần render → tối ưu hiệu năng
    // 2) Giữ ổn định tham chiếu resolver → tránh validate không cần thiết
    // 3) Đảm bảo form luôn dùng đúng schema khi chuyển giữa Login ↔ Register
    resolver: zodResolver(
      useMemo(
        () =>
          isLogin
            ? z.object({
                email: z.string().email("Email không hợp lệ"),
                password: z.string().min(7, "Phải > 6 ký tự"),
              })
            : z
                .object({
                  username: z.string().min(5, "Phải > 4 ký tự"),
                  email: z.string().email("Email không hợp lệ"),
                  password: z.string().min(7, "Phải > 6 ký tự"),
                  confirmPassword: z.string(),
                })
                .refine((v) => v.confirmPassword === v.password, {
                  path: ["confirmPassword"],
                  message: "Không khớp password",
                }),
        [isLogin]
      )
    ),
  });
  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        // Đăng nhập: gửi email/password; nhận accessToken
        const { data } = await axios.post("http://localhost:3000/login", {
          email: values.email,
          password: values.password,
        });
        localStorage.setItem("accessToken", data.accessToken);
        toast.success("Đăng nhập thành công");
        nav("/");
      } else {
        // Đăng ký: gửi username/email/password
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
      {/* Form nhập liệu; mỗi field hiển thị lỗi từ zod qua formState.errors */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              {...register("username")}
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
            {...register("email")}
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
            {...register("password")}
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
              {...register("confirmPassword")}
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
