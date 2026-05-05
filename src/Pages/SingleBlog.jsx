import { useEffect, useState } from "react"
import Navbar from "../Components/NavBar"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

function SingleBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchSingleBlog = async () => {
    try {
      const response = await axios.get("http://localhost:3000/blog/" + id)
      setBlog(response.data.data)
    } catch (err) {
      console.error("Failed to fetch blog:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSingleBlog()
  }, [])

  const deleteme = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?")
    if (!confirmed) return

    try {
      const response = await axios.delete("http://localhost:3000/blog/" + id)
      if (response.status === 200) {
        alert("Deleted successfully")
        navigate("/")
      }
    } catch (err) {
      alert("Something went wrong while deleting.")
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading...
        </div>
      </>
    )
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-64 text-gray-500">
          Blog not found.
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 dark:bg-gray-800 py-8 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Left — Image + Buttons */}
            <div className="md:w-1/2">
              <div className="h-[420px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4 overflow-hidden">
                {blog.image ? (
                  <img
                    className="w-full h-full object-contain"
                    src={`http://localhost:3000/images/${blog.image}`}
                    alt={blog.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-700 dark:hover:bg-green-700 transition"
                  onClick={() => navigate(`/edit/${id}`)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-red-100 dark:hover:bg-red-600 transition"
                  onClick={deleteme}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Right — Content */}
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                {blog.title}
              </h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-5">
                {blog.subtitle}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {blog.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default SingleBlog