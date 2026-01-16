import { Link } from "react-router-dom";

const List = () => {
  const data = [
    { id: 1, name: "Sản phẩm A" },
    { id: 2, name: "Sản phẩm B" },
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
          {data.map((item) => (
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
