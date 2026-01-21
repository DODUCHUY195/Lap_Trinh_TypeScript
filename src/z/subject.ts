import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().min(4, "Tên phải > 3 ký tự"),
  credit: z.coerce.number().positive("Số tín chỉ phải > 0"),
  category: z.enum(["Cơ sở", "Chuyên ngành", "Đại cương"]),
  teacher: z.string().min(4, "Giáo viên phải > 3 ký tự"),
});

export type SubjectForm = z.infer<typeof subjectSchema>;
export const categories = ["Cơ sở", "Chuyên ngành", "Đại cương"] as const;
