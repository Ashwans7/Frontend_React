import { BrowserRouter,Routes,Route } from "react-router-dom"
import './App.css'
import Home from "./Pages/Home"
import SingleBlog from "./Pages/SingleBlog"

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/blog/:id" element={<SingleBlog/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}