import {Link} from 'react-router';
import { useEffect } from 'react';
export default function Home(){
    useEffect(() => {
    document.title = "Home";
  }, []);
    return(
        <div>
            <p>Welcome to GLOPPS</p>
            <Link to="/logisticsconsumer"><button>Go to logistic consumer</button></Link>
        </div>
    )
}