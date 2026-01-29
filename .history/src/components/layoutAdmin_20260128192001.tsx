import { Outlet } from "react-router-dom";


function LayoutAdmin() {
    const checkLogin = localStorage.getItem("accessToken") ? true : false;
    if(checkLogin){
  return (
    <>
      <Outlet />
    </>
  )}else{
    return <div>Vui lòng đăng nhập để truy cập trang này.</div>
  };
}

export default LayoutAdmin;
