import {Link} from 'react-router';
import { useEffect } from 'react';
import './Home.css'
export default function Home(){
    useEffect(() => {
    document.title = "GLOPPS";
  }, []);
    return(
        <div className='background'>
            <div className='center-content'>
                <p className='title' style={{fontSize:'3rem'}}>GLOPPS</p>
                <Link to="/logisticsconsumer"><button className='button-primary'>Go to logistic consumer</button></Link>
            </div>
            
        </div>
    )
}