import { useState } from 'react';
import { Link } from 'react-router-dom';
import {useLogin} from '../Hooks/useLogin'
import drivingPig from '../Images/ezgif.com-crop.gif'
import Pathlogo from '../Images/pathfinder-logo.jpg'
import '../Styles/LoginPage.css'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emptyFields, setEmptyFields] = useState([])

    const {error, isLoading, login, setError} = useLogin()

    const handleSubmit = (e) =>{ 
        e.preventDefault() 
        setEmptyFields([])
        setError(null)
        login(email, password)
    }
    return (  
        <div className='user-login-screen'>
            <div className="side-display">
                <div className='logo'>
                    <img className="logo-size" src={Pathlogo} alt="" />
                </div>
                <label className='remainder'><strong>Log in to your account<br /></strong></label>
                <h3 className='remainder'>Don't have an account? </h3>
                <Link to="/user/signup"><button className='sign-up-button'>Sign Up</button></Link>

                <form onSubmit={handleSubmit}>
                    
                    <h2 className='email'>Email</h2>

                    <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email} 

                    className={emptyFields.includes('email') ? 'error': '' }/>

                    <h2 className='password'>Password</h2>

                    <input type="password"  onChange={(e)=>{setPassword(e.target.value)}} value={password}

                    className={emptyFields.includes('password') ? 'error': ''} />

                    <h3 className='remainder'>Forgot your password?</h3> 

                    <h3 className='remainder'>Click <Link to="/pathfinder"><button className='here-button'>Here</button></Link></h3>

                    {error && <div className="error">{error}</div> }
                    
                    <div className='buttons'>
                        <button className="loginbutton" disabled={isLoading}>Login</button>
                        <Link to="/pathfinder"><button className='skip-button'>Skip</button></Link>
                    </div>
                </form>
            </div>
                <div className="main-display">
                <img className="gif" src={drivingPig} alt="" />
            </div>
        </div>     
    );
}
 
export default LoginPage;