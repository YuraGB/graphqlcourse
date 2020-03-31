import React,{ useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from  './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';


function App() {
  const [login, loginHendler] = useState({token: null, userId: null});

  const logOut = () => {
      loginHendler({token: null, userId: null})
  };

  const logIn = (token, userId, tokenExpiration) => {
      loginHendler({token: token, userId: userId})
  };

  return (
    <BrowserRouter>
        <React.Fragment>
            <AuthContext.Provider
                value={{
                    token: login.token,
                    userId: login.userId,
                    login: logIn,
                    logOut: logOut
                }}>
                <MainNavigation />
                <main className='main-content'>
                    <Switch>

                        {login.token && <Redirect from='/' to="/events" exact />}
                        {login.token && <Redirect from='/auth' to="/events" exact />}
                        {!login.token && <Route path="/auth" component={AuthPage} />}
                        <Route path="/events" component={EventsPage} />
                        {login.token && <Route path="/bookings" component={BookingsPage} />}
                        {!login.token && <Redirect to="/auth" exact />}
                    </Switch>
                </main>
            </AuthContext.Provider>
        </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
