import {useAuthContext} from './useAuthContext'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'; // Import useHistory

export const useLogin = () =>{

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null) 
    const {dispatch} = useAuthContext()

 
    const login = async (email, password) => {
        if(!email || !password)
        {
            setError('All fields must be filled')
        }
        else{
            setIsLoading(true)
            setError(null)
            console.log("Is here")
            const response = await fetch('http://localhost:8001/user/login',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({email, password })
            })
    
            const json =  await response.json()
            setIsLoading(false)
            console.log(json)
            if(!response.ok)
            {
                setIsLoading(false)
                setError(json.error)
                
            }
            if(response.ok)
            {
                setIsLoading(false)
                dispatch({type: "LOGIN", payload:json});
                localStorage.setItem('token',JSON.stringify(json.returnJWT));
                localStorage.setItem('user',JSON.stringify(json));
                
            }
            
        }


    }    
    return{isLoading, login, error, setError}
}

 
