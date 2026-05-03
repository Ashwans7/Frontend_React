import { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/NavBar";
import axios from "axios";

function Home() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const response = await axios.get("http://localhost:3000/blog");
    setBlogs(response.data.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>  
      <Navbar />

      <div className="flex flex-wrap justify-center gap-4">
  {blogs.map((blog) => (
    <Card key={blog._id} blog={blog} />
  ))}
</div>
    </>
  );
}

export default Home;