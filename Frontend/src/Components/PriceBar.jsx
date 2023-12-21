import {useState,  useEffect} from 'react';
import '../Styles/PriceBar.css';

const PriceBar = ({ onValueChange,setUserPrice }) => {

    const [value, setValue] = useState(1);

    const [maxValue, setMaxValue] = useState(500);

    const handlePriceChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        setValue(newValue);
        onValueChange(newValue);
    };

    const handleMaxValueChange = (event) => {
        const newMaxValue = parseInt(event.target.value, 10);
        setMaxValue(newMaxValue);
    };

    useEffect(() => {
        if (value > maxValue) {
            setValue(maxValue);
        }
    }, [maxValue,value]);
    const handleMinPriceChange = (value) =>{
        setUserPrice(prev=>({...prev,min_price:value}))
    }
    const handleMaxPriceChange = (value) => {
        setUserPrice(prev => ({
            ...prev,
            max_price: value
        }));
    };

    return (
        <div>
  <label htmlFor="minPrice">Min Price:</label>
  <div>
    {[...Array(5)].map((_, index) => (
      <label key={`minPrice_${index}`}>
        <input
          type="radio"
          name="minPrice"
          value={index}
          defaultChecked={index === 0} // Set default value to 0
          // onChange={(e) => handleMinPriceChange(e.target.value)}
        />
        {index}
      </label>
    ))}
  </div>

  <label htmlFor="maxPrice">Max Price:</label>
  <div>
    {[...Array(5)].map((_, index) => (
      <label key={`maxPrice_${index}`}>
        <input
          type="radio"
          name="maxPrice"
          value={index}
          defaultChecked={index === 4} // Set default value to 5
          // onChange={(e) => handleMaxPriceChange(e.target.value)}
        />
        {index}
      </label>
    ))}
  </div>
</div>


    );
}

export default PriceBar;