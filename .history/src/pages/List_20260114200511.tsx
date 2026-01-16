import { Link } from "react-router-dom";

export interface Subject {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
}

export const subjects: Subject[] = [
  {
    id: 1,
    name: "ReactJS Cơ Bản",
    credit: 3,
    category: "Chuyên ngành",
    teacher: "Nguyễn Văn A",
  },
  {
    id: 2,
    name: "TypeScript",
    credit: 2,
    category: "Chuyên ngành",
    teacher: "Trần Thị B",
  },
  {
    id: 3,
    name: "Cấu trúc dữ liệu",
    credit: 3,
    category: "Cơ sở",
    teacher: "Lê Văn C",
  },
  {
    id: 4,
    name: "Lập trình C",
    credit: 4,
    category: "Đại cương",
    teacher: "Phạm Văn D",
  },
];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">  
                <Link
                  to={`/edit/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
