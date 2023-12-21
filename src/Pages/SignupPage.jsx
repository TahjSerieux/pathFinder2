import { useState } from "react";
import { Link } from "react-router-dom";
import '../Styles/SignupPage.css'
import { useSignup } from "../Hooks/useSignup";


const SignupPage = () => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfrimPassword] = useState('')
    const [emptyFields, setEmtpyFields] = useState([])
    const [isAgreementChecked, setIsAgreementChecked] = useState(false)
    const {isLoading, error, signup, setError, setIsLoading} = useSignup()

        const areAllFieldsFilled =() =>{
   
        if(!firstName)
        {
            setEmtpyFields(['first-name',...emptyFields])
        }
        if(!lastName)
        {
            setEmtpyFields(['last-name',...emptyFields])
        }
        if(!email)
        {
            setEmtpyFields(['email',...emptyFields])
        }
        if(!password)
        {
            setEmtpyFields(['password',...emptyFields])
        }
        if(!confirmPassword)
        {
            setEmtpyFields(['confirmPassowrd',...emptyFields])
        }
        if(!firstName || !lastName || !email || !password || !confirmPassword)
        {
            setError('All fields must be filled')
            return false
        }
        else{
            return true
        }
    }
    const handleAgreementCheck = (e) =>{
        setIsAgreementChecked(e.target.checked) 
    }

    const handleSignup = async  (e) =>{

        e.preventDefault()
        setEmtpyFields([])
        setError(null)
        
        if(areAllFieldsFilled()  === true)
        {
            
            if(password === confirmPassword)
            {
                setIsLoading(true)
                signup(email,password, firstName, lastName);
            }
            else{
                setError('Passwords must match');
            }
        }
        else{
            setError('All fields must be filled');
        }
    }
    
    return ( 
        <div className='user-signup-screen'>
            <div className="side-display">
            </div>
            <div className="main-display">
                <form onSubmit={handleSignup}>
                    <label className="creating">Create your account</label>
                        <h3 className='first-name'>First Name</h3>
                        <input type="text" onChange={(e) =>{setFirstName(e.target.value)}} 
                        value={firstName}
                        className={emptyFields.includes('first-name') ? 'error': ''}/>

                        <h3 className='last-name'>Last Name</h3>
                        <input type="text" onChange={(e) =>{setLastName(e.target.value)}} 
                        value={lastName}
                        className={emptyFields.includes('last-name') ? 'error': ''}/>

                        <h3 className='email'>Email Address</h3>
                        <input type="text" onChange={(e) =>{setEmail(e.target.value)}} 
                        value={email}
                        className={emptyFields.includes('email') ? 'error': ''}/>

                        <h3 className='password'>Password</h3>
                        <input type="password" onChange={(e) =>{setPassword(e.target.value)}} 
                        value={password}
                        className={emptyFields.includes('password') ? 'error': ''}/> <br />

                        <h3 className='confirm-password'>Confirm Password</h3>
                        <input type="password" onChange={(e) =>{setConfrimPassword(e.target.value)}}
                        value={confirmPassword}
                        className={emptyFields.includes('confirm-password') ? 'error': 'confrim-password'}/> <br />
                        <br />
                        <input type="checkbox"
                        value={isAgreementChecked}
                        onChange={handleAgreementCheck} />
                        <label className="terms" htmlFor="">
                        I accept the <a href="/">Privacy Policy</a> and the <a href="/">Terms of Service</a></label><br/>
                        <br/>{error && <div className="error">{error}</div> }
                        {/* <button disabled={(!agreement)} onClick={handleSignup}>Sign up</button> */}
                        <br/><button className='sign-up' disabled={(isLoading || !isAgreementChecked )} onClick={(e)=> handleSignup(e)}>Sign up</button><br/>
                        <br/><label className="p1"> Already have an account? </label><Link to="/user/login"><button className='go-back'>Log In</button></Link>
                        <br/><Link to="/user/login"><br/><button className='go-back'>Go Back</button></Link>
                </form>
            </div>
        </div>
     );
}
 
export default SignupPage;