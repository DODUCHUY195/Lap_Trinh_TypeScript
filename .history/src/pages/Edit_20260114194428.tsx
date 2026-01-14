import { useParams } from "react-router-dom";

const Edit = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit sản phẩm</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default Edit;
