import { Link } from "react-router-dom"

function Card({ blog }) {
  return (
    <Link to={`/blog/${blog._id}`}>
    <div className="w-full sm:w-80 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      
      {/* Image */}
      <img
        src={`http://localhost:3000/images/${blog.image}`}
        alt={blog.title}
       className="w-full h-52 object-contain bg-gray-100"
      />

      {/* Content */}
      <div className="p-5 text-center">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">
          {blog.title}
        </h2>

        <p className="text-gray-600 mt-3 text-sm line-clamp-3">
          {blog.description}
        </p>

        {/* Button */}
        <button className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300">
          Read More
        </button>
      </div>
    </div>
    </Link>
  )
}

export default Card;