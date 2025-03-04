import {useState} from 'react';
import { login } from '../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:5000/auth/login', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            })
            if(!response.ok){
                throw new Error('Login failed')
            }
            
            
            const data = await response.json();
            console.log(data);
            dispatch(login({
                userId: data.user._id,
                username: data.user.username, 
                email: data.user.email, 
                status: true
            }));
            localStorage.setItem('jwt', data.jwt_token);
            navigate('/home');
        } catch(error){
            console.error('Error:', error);
        }
    }

    return (

        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input 
                type="text" 
                id="username" 
                value ={email} 
                onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password: </label>
            <input 
                type="text" 
                id="password" 
                value ={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>


    )
}

export default Login;