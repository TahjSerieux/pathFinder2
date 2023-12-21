import { useEffect, useState } from "react";

const SearchBar = ({placeHolder}) => {
    const [value, setValue] = useState('');

    const handleValueChange = (e) => {
        setValue(e.target.value)
    }
    useEffect (() =>{
        const timeout =  setTimeout(()=>{
            console.log(value)
        },1000)

        return (()=>{
            clearTimeout(timeout)

        })
      
    },[value]);


    return (
        <input type="text" placeholder={placeHolder? placeHolder: 'search'} onChange={ e => handleValueChange(e)} />
      );
}
 
export default SearchBar;