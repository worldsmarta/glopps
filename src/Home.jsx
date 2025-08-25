
import { useEffect } from 'react';
import './Home.css'

export default function Home(){
    useEffect(() => {
    document.title = "GLOPPS";
  }, []);
    return(
       
            <div className="home-content">
            <div className='center-content'>
                <p className='title' style={{fontSize:'3rem'}}>GLOPPS</p>
            </div>
           </div> 
        
    )
}