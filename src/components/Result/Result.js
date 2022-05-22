import {useLocation, Link} from 'react-router-dom';
import './Result.css';

const Result = () => {
    const location = useLocation();
    return (
        <div className='Result-main'>
            {location && location.state !== null &&
                <>
                {(location.state.status === "success" ? 
                    <>
                        <h1>We found the queen on planet : {location.state.name}</h1>
                        <h2>Mission outcome : {location.state.status}</h2>
                        <h2>Planet name : {location.state.name}</h2>
                    </> :
                    <>
                        <h1>We didn't found the queen on any of the chossen planet.</h1>
                        <h2>Mission outcome : {location.state.status}</h2>
                    </>
                )}
                <div>To start a new search mission, please <Link to="/">click here</Link></div>
                </>
            }
            {!location.state &&
                <>
                <h1>Welcome to the result page, but we don't have any result to show you right now.</h1>
                <div>To start a new search mission, please <Link to="/">click here</Link></div>
                </>
            }
        </div>
    )
}

export default Result;