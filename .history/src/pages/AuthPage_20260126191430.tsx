import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type BooleanProps = {    
    isRegister: boolean;
};

function AuthPage({ isRegister }: BooleanProps) {
      const {
        register,
        handleSubmit,
      } = useForm({
        mode: "onBlur",
      });

      const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/subjects", {
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
            <input type="password" id="password" name="password" />
        </div>
    </form>
  </div>;
}

export default AuthPage;