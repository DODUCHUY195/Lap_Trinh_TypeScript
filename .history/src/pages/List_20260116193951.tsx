import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Subject } from "../types/Subject";


const List = () => {

  const [subjects, setSubjects] = useState<Subject[]>([]);
  useEffect(() => {
    const getAll = async () => {
      try {
      const response = await fetch("http://localhost:8000/subjects");
      const data = await response.json();
      setSubjects(data);
    }catch (error) {
      console.error("Error fetching subjects:", error);
    }
    }
    getAll();
    // fetch("http://localhost:3000/subjects")
    //   .then((response) => response.json())
    //   .then((data) => setSubjects(data));
  }, []);

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
