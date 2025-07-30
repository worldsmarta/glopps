import {Link} from 'react-router';
export default function Home(){
    return(
        <div>
            <p>Welcome to GLOPPS</p>
            <Link to="/logisticsconsumer"><button>Go to logistic consumer</button></Link>
        </div>
    )
}