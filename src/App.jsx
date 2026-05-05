import { BrowserRouter,Routes,Route } from "react-router-dom"
import './App.css'
import Home from "./Pages/Home"
import SingleBlog from "./Pages/SingleBlog"
import CreateBlog from "./Pages/CreateBlog"

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/create" element={<CreateBlog/>}/>
      <Route path="/blog/:id" element={<SingleBlog/>}/>
      
      
      
    </Routes>
    </BrowserRouter>
    </>
  )
}