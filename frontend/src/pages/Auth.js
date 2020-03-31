import React, {  useState, useContext} from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

const AuthPage = (props) =>  {
    const [isLogin, switchMode] = useState(true);
    const emailEl = React.createRef();
    const passwordEl = React.createRef();

    const switchModeHendler = () => {
        switchMode(!isLogin)
    };

    const contextType = useContext(AuthContext);

    const submitHandler = (event) => {
        event.preventDefault();
        const email = emailEl.current.value;
        const password = passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }

        let requestBody = {
            query: `
                query Login($email: String!, $password:String!)  {
                    login(email: $email, password: $password) {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `,
            variables: {
                email: email,
                password: password
            }
        };

        if (!isLogin) {
            requestBody = {
                query: `
                mutation CreateUser($email: String!, $password:String!) {
                    createUser(userInput: {
                        email: $email,
                        password: $password                        
                    }) {
                        _id
                        email
                    }
                }
            `,
                variables: {
                    email: email,
                    password: password
                }
            };
        }

        fetch('http://localhost:4000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": 'application/json'
            }
        }).then((res) => {
            if( res.status !== 200 && res.status !== 201) {
                throw  new Error('Failed');
            }

            return res.json();
        })
            .then((res) => {
                if(res.data.login.token) {
                    contextType.login(res.data.login.token, res.data.login.userId, res.data.login.tokenExpiration)
                }
            })
            .catch(console.log)
    };

        return (
        <form className='auth-form' onSubmit={submitHandler}>
            <div className='form-control'>
                <label htmlFor="email">E-Mail</label>
                <input type='email' id='email' ref={emailEl}/>
            </div>
            <div className='form-control'>
                <label htmlFor="password">Password</label>
                <input type='password' id='password' ref={passwordEl}/>
            </div>
            <div className='form-actions'>
                <button type='submit' >Submit</button>
                <button type='button' onClick={switchModeHendler}> Switch to { isLogin ? 'Signup' : 'Signin'}</button>
            </div>
        </form>
    )
};

export default AuthPage;