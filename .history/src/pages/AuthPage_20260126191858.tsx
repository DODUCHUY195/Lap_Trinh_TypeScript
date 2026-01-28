import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type BooleanProps = {    
    isRegister: boolean;
};

function AuthPage({ isRegister }: BooleanProps) {
      const {
        register,
        handleSubmit,
      } = useForm({});

      const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) return;
      await res.json();
      toast.success("Thêm thành công");
     
    } catch {
      toast.error("Thêm thất bại");
    }
  };

  return <div>

    {isRegister ? "register" : "login"}
    <form onSubmit={handleSubmit(onSubmit)}>
        <div>
            <label htmlFor="username">Username</label>
            <input {...register("username")} type="text" id="username" name="username" />

        </div>

        <div>
            <label htmlFor="password">Password</label>
            <input {...register("password")} type="password" id="password" name="password" />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
            {isRegister ? "Đăng Ký" : "Đăng Nhập"}
        </button>
    </form>
  </div>;
}

export default AuthPage;