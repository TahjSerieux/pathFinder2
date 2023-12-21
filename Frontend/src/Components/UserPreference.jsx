import React, { useState, useRef } from 'react';
import '../Styles/UserPreference.css';
import ColorButton from '../Components/ColorButton';
import ItemDiv from '../Components/ItemDiv';
import PriceBar from '../Components/PriceBar';
import RadiusBar from './RadiusBar';
import { useAuthContext } from '../Hooks/useAuthContext';
  // const mapDivRef = useRef(null)

const UserPreference = ({setRadiusValue, selectedOption, setUserPrice,searchBarValue,setTabView, getSavedRoutes ,setSelectedLocations,setSearchBarValueM,setradius,setSearchBarValue,findMidwayPoint,findEndPoint}) => {
  const{user} = useAuthContext()
  const [visibleSections, setVisibleSections] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [priceBarValue, setPriceBarValue] = useState(1);
  const [radiusBarValue, setRadiusBarValue] = useState(1);
  const inputFieldRef = useRef(null)


  const toggleVisibility = (section) => {

    const updatedSections = { ...visibleSections };

    updatedSections[section] = !updatedSections[section];

    setVisibleSections(updatedSections);
  };


  const handleItemClick = (label) => {
    if (selectedItems.includes(label)) {
      // setSelectedItems([...selectedItems, label]);
      const updatedItems = selectedItems.filter((item) => item !== label);
      setSelectedItems(updatedItems);
      setSelectedLocations(updatedItems);


    } else {
    
      // setSelectedItems(selectedItems.filter((item) => item !== label));
      setSelectedItems([...selectedItems, label]);
      setSelectedLocations(selectedItems);
    }
  };

  const handlePriceChange = (newValue) => {
    setPriceBarValue(newValue);
    console.log(newValue)
  };

  const handleRadiusChange = (newValue) => {
    setRadiusBarValue(newValue);
    console.log(newValue)
  };


  const saveInputFieldValue = () =>{
    if(inputFieldRef && inputFieldRef.current.value){
      const keyWord = inputFieldRef.current.value.trim()
      if(keyWord.length != 0){
        if(searchBarValue.includes(keyWord)){
          alert("Keyword already added")

        }else{
          setSearchBarValue(prev=>[...prev,keyWord])
          inputFieldRef.current.value = ""
        }
        
      }else{
        alert("Input field has not valid input")
      }
    }
  }
  const deleteKeyword = (index)=>{
    let arr = searchBarValue.filter((_, currentIndex) => index !== currentIndex);
    setSearchBarValue(arr);
  }
  return (
    <div className="UserPreference">
      {/* {selectedItems} */}
      <div className="filter">
      {/* <ColorButton
        id="1"
        label="Other"
        target="Other"
        isVisible={visibleSections['Other']}
        toggleVisible={() => toggleVisibility('Other')}
      /> */}
     {selectedOption==="Endpoint" &&  <ColorButton
        id="2"
        label="Find Destination"
        target="Food"
        isVisible={visibleSections['Food']}
        toggleVisible={() => toggleVisibility('Food')}
        onClickFunction={()=>findEndPoint()}
        setTheTabView={()=>setTabView("EndPoint")}
        
      />}
      {selectedOption==="Midpoint" &&<ColorButton
        id="3"
        label="Find Midpoint"
        target="Activity"
        isVisible={visibleSections['Activity']}
        toggleVisible={() => toggleVisibility('Activity')}
        onClickFunction={()=>findMidwayPoint()}
        />}
      {
  selectedOption === "Favorite" ? (
    user ? (
      <ColorButton
        userExist='userTrue'
        id="3"
        label="Get Favorites"
        target="Activity"
        isVisible={visibleSections['Activity']}
        toggleVisible={() => toggleVisibility('Activity')}
        functionClick={findMidwayPoint}
        setTabView={() => setTabView("Favorite")}
        onClickFunction={() => getSavedRoutes()}
      />
    ) : (
      <ColorButton
        userExist='userFalse'
        onClickFunction={() => getSavedRoutes()}
        id="3"
        label="Get Favorites"
        target="Activity"
        isVisible={visibleSections['Activity']}
        toggleVisible={() => toggleVisibility('Activity')}
        functionClick={findMidwayPoint}
      />
    )
  ) : null // This can be replaced with another component or null if no rendering is needed when selectedOption !== "Favorite"
}

      {/* <ColorButton
        id="4"
        label="Shelter"
        target="Shelter"
        isVisible={visibleSections['Shelter']}
        toggleVisible={() => toggleVisibility('Shelter')}
      /> */}
      </div>

      {/* {visibleSections['Other'] && (
        <div className="container">
          <div className="type">Other</div>
        </div>

      )}
      {visibleSections['Food'] && (
        <div className='container'>
          <div className="type">Dietary</div>
          <ItemDiv label="Cafe" buttonClick={() => handleItemClick("Cafe")} isSelected={selectedItems.includes("Cafe")} />
            <ItemDiv label="Bakery" buttonClick={() => handleItemClick("Bakery")} isSelected={selectedItems.includes("Bakery")} />
            <ItemDiv label="Convenience Store" buttonClick={() => handleItemClick("Convenience Store")} isSelected={selectedItems.includes("Convenience Store")} />
            <ItemDiv label= "Supermarket" buttonClick={() => handleItemClick("Supermarket")} isSelected={selectedItems.includes("Supermarket")} />
            <ItemDiv label= "Restaurant" buttonClick={() => handleItemClick("Restaurant")} isSelected={selectedItems.includes("Restaurant")} />
            <ItemDiv label= "Take-out" buttonClick={() => handleItemClick("Take-out")} isSelected={selectedItems.includes("Take-out")} />
          </div>
      )} */}

      {/* {visibleSections['Activity'] && (
        <div className="container">
          <div className="type">Activity</div>
            <ItemDiv label="Spa" buttonClick={() => handleItemClick("Spa")} isSelected={selectedItems.includes("Spa")} />
            <ItemDiv label="Zoo" buttonClick={() => handleItemClick("Zoo")} isSelected={selectedItems.includes("Zoo")} />
            <ItemDiv label="Park" buttonClick={() => handleItemClick("Park")} isSelected={selectedItems.includes("Park")} />
            <ItemDiv label= "Gym" buttonClick={() => handleItemClick("Gym")} isSelected={selectedItems.includes("Gym")} />
            <ItemDiv label= "Casino" buttonClick={() => handleItemClick("Casino")} isSelected={selectedItems.includes("Casino")} />
            <ItemDiv label= "Aquarium" buttonClick={() => handleItemClick("Aquarium")} isSelected={selectedItems.includes("Aquarium")} />
        </div>
      )}

      {visibleSections['Shelter'] && (
        <div className="container">
          <div className="type">Shelter</div>
        </div>
      )} */}

      <PriceBar setUserPrice={()=> setUserPrice()}nValueChange={handlePriceChange} />
      <RadiusBar setRadiusValue={setRadiusValue} setradius={setradius} Change={handleRadiusChange} />
      {searchBarValue && (
        <div className="keyword-values">
          {searchBarValue.map((keyword, index) => (
            <label
            onClick={() => deleteKeyword(index)}
            htmlFor=""
            key={index}
            style={{
              marginLeft: '4px',
              transition: 'color 0.2s, text-decoration 0.2s', // Added text-decoration transition
              cursor: 'pointer',
              color: 'white', // Initial text color
              textDecoration: 'underline', // Initial text decoration (no underline)
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'red';
              e.target.style.textDecoration = 'underline'; // Add underline on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'white';
              e.target.style.textDecoration = 'none'; // Remove underline on hover out
            }}
          >
            {keyword}
          </label>
          ))}
        </div>
      )}
      <input ref={inputFieldRef} type="text" placeholder='search' />
      <button className="submit" onClick={()=>saveInputFieldValue()}>Submit</button>

    </div>
  );
};

export default UserPreference;