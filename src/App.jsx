import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import SingleBlog from './Pages/SingleBlog';
import CreateBlog from './Pages/CreateBlog';
import EditBlog from './Pages/EditBlog';
import About from './Pages/About';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './Components/NavBar';

function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <p className="text-7xl font-black text-stone-200 dark:text-stone-800 mb-4">404</p>
        <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">Page not found</h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-7 max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<SingleBlog />} />
            <Route path="/edit/:id" element={<EditBlog />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
