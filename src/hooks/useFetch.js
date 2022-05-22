import { useState, useEffect } from "react";
import { BASE_API_URL } from "../constants";

const useFetch = ({endPoint,  method = 'GET', requestBody = {}}) => {
    const [data, setData] = useState('');
    let error = '';

    let headerObj = {};
    if(method === 'GET') {
        headerObj['method'] = method;
    } else if(method === 'POST') {
        headerObj['method'] = 'POST';
        headerObj['body'] = requestBody;
    }

    useEffect(() => {
        fetch(`${BASE_API_URL}/${endPoint}`, headerObj)
        .then((res) => res.json())
        .then((parsedRes) => {
            console.log(parsedRes);
            setData(parsedRes);
        })
        .catch((err) => {
            error = err;
            console.log(`error, while fetching the planet list`, err);
        })
    }, []);

    return [data, setData, error];
}

export default useFetch;