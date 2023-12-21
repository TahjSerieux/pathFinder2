import { useEffect } from "react";

const DestinationPicker = ({pathOrigin, pathDestination,setOrigin,setDestination}) => {

  const areFieldsFilled = () =>{
    if(pathOrigin && pathDestination)
    {
      console.log("Both fields are filled")
    }

  }

  useEffect(()=>{
    const timeOut = setTimeout(()=>{
      console.log(pathOrigin)
      areFieldsFilled()
      
    },1000)

    return(()=>{
      clearTimeout(timeOut)
    })

    
  },[pathOrigin,areFieldsFilled])

  useEffect(()=>{
    const timeOut = setTimeout(()=>{
      console.log(pathDestination)
      areFieldsFilled()
     
    },1000)
    return(()=>{
      clearTimeout(timeOut)
    })
  },[pathDestination,areFieldsFilled])

  // useEffect(()=>{
  //   if(pathOrigin &&  pathDestination)
  //   {
  //     console.log("Both fields are filled")
  //   }
  // },[pathOrigin,pathDestination])

    return (
        <div className="destination-picker">
                <input type="text" name="" id="" placeholder='Choose a starting location...' onChange={e => setOrigin(e.target.value) }/>
                <input type="text" name="" id="" placeholder='Choose a destination...' onChange={e => setDestination(e.target.value)}/>
        </div>
      );
}
 
export default DestinationPicker;