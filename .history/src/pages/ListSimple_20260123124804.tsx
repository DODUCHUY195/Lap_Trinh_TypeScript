import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Subject = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListSimple() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("/api/subjects?page=1&limit=1000");
        setSubjects(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Teacher</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.teacher}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <Link to={`/edit/${item.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListSimple;
