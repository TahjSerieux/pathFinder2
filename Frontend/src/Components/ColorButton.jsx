import { useState } from 'react';
import '../Styles/UserPreference.css';

const ColorButton = ({ label, target, isVisible, toggleVisible, onClickFunction,findEndPoint,userExist,setTheTabView }) => {

    const [isClicked, setIsClicked] = useState(false);
  
    const handleClick = () => {
      onClickFunction()
    };
  
    const buttonClasses = `choice ${isClicked ? 'clicked' : ''}`;
  
    return (
      <div>
        <button className={`${buttonClasses} ${userExist}`} onClick={()=>handleClick()}>
          {label}
        </button>
      </div>
    );
  };
  
  export default ColorButton;