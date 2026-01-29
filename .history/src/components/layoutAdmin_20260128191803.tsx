import { Outlet } from "react-router-dom";
import { check } from "zod";

function LayoutAdmin() {
    const checkLogin = true;
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
