import {useState,  useEffect, useRef} from 'react';
import '../Styles/RadiusBar.css';

const RadiusBar = ({ onRadiusChange,setRadiuss,setRadiusValue }) => {
    const radiusInputRef = useRef(null)
    const valuePicker = useRef(null)
    const [Radius, setRadius] = useState(1);

    const [maxRadius, setMaxRadius] = useState(500);

    const handleRadiusChange = () => {
        // console.log(radiusInputRef.current.value)
        if(radiusInputRef){
            // setRadiusValue
            const radiusValue  = radiusInputRef.current.value;
            valuePicker.current.value = radiusValue
            setRadiusValue(radiusValue)
        }
    };

    const handleMaxRadiusChange = (event) => {
        const newMaxRadius = parseInt(event.target.value);
        setMaxRadius(newMaxRadius);
    };
    const RadiusSliderManualInput = (e) =>{
        if(e.target.value > -1 && e.target.value < 50001){
            radiusInputRef.current.value = e.target.value
            handleRadiusChange();

        }
    }

    // useEffect(() => {
    //     if (Radius > maxRadius) {
    //         setRadius(maxRadius);
    //     }
    // }, [maxRadius,Radius]);
    useEffect(()=>{

    },[])

    return (
        <div>
            <div className='type'>Radius</div>
            <div>
            <input ref={radiusInputRef} defaultValue={5000} type='range' id="Radius" name="Radius" min="1" max='50000' step='1000' Radius={Radius} onChange={handleRadiusChange}/>
            <input ref={valuePicker} defaultValue={5000} type="number"  id="maxRadius" name="maxRadius" Radius={maxRadius} onChange={ e => RadiusSliderManualInput(e)}/>
            <p className='Radius'>{Radius}</p>
            </div>
        </div>
    );
}

export default RadiusBar;