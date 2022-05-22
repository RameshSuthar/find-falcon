import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import PlanetVehicleBox from "../PlanetVehicle/PlanetVehicleBox";
import './Home.css';
import { BASE_API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";

const NUM_OF_PLANETS_TO_VISIT = 4
const Home = (props) => {
    /**
     * useFetch hook will return an array of data(which will store the api data response), 
     * setData function(which is used to set the data state) and error(which will have the error message
     * in case of the api call fails)
     * 
     * the props to the useFetch is an object with property name as 
     * endPoint(the api endpoint to hit) required
     * method(which denotes the api method) optional and default is 'GET'
     * requestBody(Incase of POST or PUT api call,this will contain the body) optional for 'GET' request
     */
    const [vehicleList, setVehicleList, vehicleError] = useFetch({endPoint: 'vehicles'});
    const [planetList, setPlanetList, planetError] = useFetch({endPoint: 'planets'});
    const [totalTime, setTotalTime] = useState(0);
    const navigate = useNavigate();

    //to keep tract of selected value of planet
    const [selectedPlanets, setSelectedPlanets] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);

    const handleVehicleListChange = (val, index) => {
        //get the current vehicle object from vehicle list
        const currentVehicle = vehicleList.filter((vehicle) => {
            if(vehicle.name === val) {
                return vehicle;
            }
        })

        //set the state with current vehicle object at the given index
        const tempList = [...selectedVehicles];
        tempList[index] = currentVehicle[0];
        setSelectedVehicles(tempList);
    }

    const handlePlanetListChange = (val, index) => {
        //get the current planet object from planet list
        const currentPlanet = planetList.filter((planet) => {
            if(planet.name === val) {
                return planet;
            }
        })

        const tempList = [...selectedPlanets];
        tempList[index] = currentPlanet[0];
        setSelectedPlanets(tempList);
    }

    const calculateAndSetTimeRequired = () => {
        if(selectedPlanets.length === 0 || selectedVehicles.length === 0) {
            return;
        }
        let totalTimeRequired = 0;
        for(let i = 0; i < selectedVehicles.length; i++) {
            let speedOfVehicle = Number(selectedVehicles[i]?.speed);
            let distanceToPlanet = Number(selectedPlanets[i]?.distance);
            let timeToReachCurrentPlanet = distanceToPlanet / speedOfVehicle;
            totalTimeRequired += timeToReachCurrentPlanet;
        }
        setTotalTime(totalTimeRequired);
    }

    const planetVehicleContainer = [...Array(NUM_OF_PLANETS_TO_VISIT)].map((ele, i) => {
        return (
        <PlanetVehicleBox key={i} id={i} onPlanetSelect={handlePlanetListChange} onVehicleSelect={handleVehicleListChange}
                 planetList={planetList} vehicleList={vehicleList} selectedPlanets={selectedPlanets}
                 selectedVehicles={selectedVehicles}/>
        );
    });

    const handleResultSubmit = async () => { 
        //get token 
        const token = await callApiAndGetJsonData({endPoint: 'token', body: {}, method: 'POST'});

        //create payload 
        const getPlanetNames = selectedPlanets.map((planet) => planet.name);
        const getVehicleNames = selectedVehicles.map((vehicle) => vehicle.name);
        const payload = {
            'token' : token.token,
            'planet_names' : getPlanetNames,
            'vehicle_names': getVehicleNames
        };

        //send the payload to server and get result
        const parsedRes = await callApiAndGetJsonData({endPoint: 'find', body: payload, method: 'POST'});
        if(!parsedRes.error) {
            console.log('inside navi')
            navigate("/result", {state:{status: parsedRes.status, name: parsedRes.planet_name}});
        }
    }

    const callApiAndGetJsonData = async ({endPoint, body, method}) => {
        const response = await fetch(`${BASE_API_URL}/${endPoint}`, {
            method: method,
            headers: {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(body)
        });
        const parsedRes = await response.json();
        return parsedRes;
    }

    useEffect(() => {
        calculateAndSetTimeRequired();
    }, [selectedPlanets, selectedVehicles]);


    // show loader until we get the data
    if(!vehicleList || !planetList) {
        return <h3>Loading...</h3>
    }
    // show error message if we fail to get the data
    if(vehicleError || planetError) {
        return <h3>Couldn't get the vehicle or planet list from server. Please check logs for more information.</h3>
    }

    return (
        <div className="Home-main">
            <h1>Welcome to Finding Falcon Mission!!</h1>
            <div className="Home-planet-vehicle-time-wrapper">
                <div className="Home-planet-vehicle-container">
                    {planetVehicleContainer}
                </div>
            </div>
            <div className="Home-find-btn-wrapper">
                <div className="Home-time-required">Time Required : {totalTime}</div>
                <button disabled={selectedPlanets.length < 4} onClick={handleResultSubmit}>find falcon</button>
            </div>
        </div>
    )
}

export default Home;