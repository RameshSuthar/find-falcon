import { useState, useRef } from "react";
import './PlanetVehicleBox.css';

const PlanetVehicleBox = (props) => {

    const [planetSelect, setPlanetSelect] = useState('');
    const [vehicleSelect, setVehicleSelect] = useState('');

   const handleOnClickLabel = (e, val) => {
        if(e.detail === 0) return;
        e.stopPropagation();
        setVehicleSelect(val);
        props.onVehicleSelect(val, props.id);
   }

    const handlePlanetOnChange = (e) => {
        setPlanetSelect(e.target.value);
        props.onPlanetSelect(e.target.value, props.id);
    }

    const isPlanetPartOfSelectedPlanets = (planetName) => {
        if(props.selectedPlanets.length === 0) return false;
        return props.selectedPlanets.some((planet, index) => {
            return (index !== props.id && planet.name === planetName);
        });
    }

    const planetSelectOptions = props.planetList.map((planet) => {
        if(isPlanetPartOfSelectedPlanets(planet.name)) return;
        return (
            <option key={planet.name} value={planet.name}>{planet.name}</option>
        )
    });

    const vehicleRadioButtons = props.vehicleList.map((vehicle) => {
        let unitLeft = vehicle.total_no;
        props.selectedVehicles?.map((veh) => {
            if(veh?.name === vehicle.name && unitLeft > 0){
                unitLeft--;
            }
        });

        const isDisable = vehicle.max_distance < props.selectedPlanets[props.id]?.distance;
        return (
            <div key={vehicle.name} className={isDisable ? "disable" : ""}>
                <label htmlFor={vehicle.name} onClickCapture={(e) => handleOnClickLabel(e, e.currentTarget.firstChild.value)}>
                <input type="checkbox" checked={vehicleSelect === vehicle.name} name={vehicle.name} 
                    value={vehicle.name} id={vehicle.name} onChange={() => ""}/>
                    {vehicle.name} ({unitLeft})
                </label>
            </div>
        )
    });

    return (
        <div className="PlanetVehicleBox-wrapper">
            <h3>Select destination {props.id+1}</h3>
            <select className={"PlanetVehicleBox-planet-list" + (props.id > 0 && !props.selectedVehicles[props.id-1] ? " disable" : "")} onChange={handlePlanetOnChange} value={planetSelect}>
                <option value="">select</option>
                {planetSelectOptions}
            </select>

            {planetSelect &&
                <>
                <h3>Select vehicle : {props.id+1}</h3>
                <div className="PlanetVehicleBox-vehicle-list">
                    {vehicleRadioButtons}
                </div>
                </>
            }
        </div>
    )
}

export default PlanetVehicleBox;