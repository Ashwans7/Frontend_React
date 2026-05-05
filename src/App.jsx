import { BrowserRouter,Routes,Route } from "react-router-dom"
import './App.css'
import Home from "./Pages/Home"
import SingleBlog from "./Pages/SingleBlog"
import CreateBlog from "./Pages/CreateBlog"
import EditBlog from "./Pages/EditBlog";

export default function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path="/create" element={<CreateBlog/>}/>
      <Route path="/blog/:id" element={<SingleBlog/>}/>
     <Route path="/edit/:id" element={<EditBlog />} />

      
      
      
    </Routes>
    </BrowserRouter>
    </>
  )
}