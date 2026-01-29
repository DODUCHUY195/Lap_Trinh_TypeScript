import toast, { Toaster } from "react-hot-toast";
import { Link, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";

import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import AuthPage from "./pages/AuthPage";
import { useEffect, useState } from "react";
import LayoutAdmin from "./components/layoutAdmin";

function App() {
  const nav = useNavigate();
  // Trạng thái đăng nhập: true nếu có accessToken trong localStorage
  const [isAuthed, setIsAuthed] = useState<boolean>(Boolean(localStorage.getItem("accessToken")));
  // Thông tin user (lưu từ login)
  const [user, setUser] = useState<any>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  // Cập nhật mỗi khi thay đổi đường dẫn (sau login/logout điều hướng)
  const location = useLocation();
  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem("accessToken")));
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

    const handleLogout = () => {
      return () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setIsAuthed(false);
        setUser(null);
        toast.success("Đăng xuất thành công");
        nav("/login");
      }
    }
    
  return (
    <>
      {/* NAVBAR */}
     
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            <strong>App</strong>
          </Link>

          <div className="flex items-center space-x-6">
            {isAuthed ? (
              <>
                <span>Welcome, {user?.username || user?.email || "User"}</span>
                <Link to="/" className="hover:text-gray-200">
                  Danh sách
                </Link>
                <Link to="/add" className="hover:text-gray-200">
                  Thêm mới
                </Link>
                <button className="hover:text-gray-200" onClick={handleLogout()}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/register" className="hover:text-gray-200">
                  Đăng Ký
                </Link>
                <Link to="/login" className="hover:text-gray-200">
                  Đăng Nhập
                </Link>
              </>
            )}
           
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-10 px-4">
        <Routes>
          

          {/* Trang danh sách luôn truy cập được */}
          <Route element={<LayoutAdmin />}>
            <Route path="/" element={<List />} />
          </Route>
          {/* Nhóm route yêu cầu đăng nhập */}
          <Route element={isAuthed ? <LayoutAdmin /> : <Navigate to="/login" replace />}>
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
