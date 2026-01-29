import { Toaster } from "react-hot-toast";
import { Link, Routes, Route } from "react-router-dom";

import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import AuthPage from "./pages/AuthPage";


function App() {


  return (
    <>
      {/* NAVBAR */}
     
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            <strong>App</strong>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">
              Danh sách
            </Link>
            <Link to="/add" className="hover:text-gray-200">
              Thêm mới
            </Link>
             <Link to="/register" className="hover:text-gray-200">
              Đăng Ký
            </Link>
            <Link to="/login" className="hover:text-gray-200">
              Đăng Nhập
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          <Route path="/" element={<List />}>
          
          <Route element={<></>} />
          <Route path="/add" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
          </Route>

          <Route path="/register" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
         
        </Routes>
      </div>

      <Toaster />
    </>
  );
}

export default App;
