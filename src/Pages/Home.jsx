import { useEffect } from "react"
import Card from "../Components/Card"
import Navbar from "../Components/NavBar"
import axios from "axios"


function Home(){
    const fetchBlogs= async()=>{
       const response = await axios.get("http://localhost:3000/blog")

    }
    console.log(fetchBlogs)
    
    
    useEffect(()=>{
        fetchBlogs()

    },[])
return(
<>
<Navbar/>
<div className="flex flex-wrap">
    <Card/>
<Card/>
<Card/>
<Card/>
<Card/>

</div>


</>
)
}


export default Home