export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Title / Logo */}
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          MySite
        </h1>

        {/* Links */}
        <ul className="flex space-x-8 text-gray-600 font-medium">
          <li>
            <a href="#" className="hover:text-black transition duration-200">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-black transition duration-200">
              About
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-black transition duration-200">
              Contact
            </a>
          </li>
        </ul>

      </div>
    </nav>
  );
}