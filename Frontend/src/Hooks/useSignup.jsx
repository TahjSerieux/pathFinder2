import { useState } from 'react'
import {useAuthContext}  from  './useAuthContext'


export const useSignup = () =>{
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const {dispatch} = useAuthContext()


    const signup = async (email, password, firstName, lastName) =>{
        setError(null);
        setIsLoading(true);
        // alert('singing up');

        const response = await fetch('http://localhost:8001/user/signup',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email,password,firstName,lastName})
        });
        // console.log("HERE");
        const json =  await response.json() 

        if(!response.ok)
        {
            setError(json.error); 
            setIsLoading(false);
        } 
        if(response.ok)
        {
            setIsLoading(false);
            dispatch({type:'LOGIN', payload:json});
            localStorage.setItem('user',JSON.stringify(json.returnJWT))
            // alert(json.mssg, json.userAccount, json.returnJWT)
        
        }
        
            // setIsLoading(false);
        

    }
    return {isLoading, error, signup, setError, setIsLoading}





}