// import React, { use } from 'react';
// import { useState } from 'react';
import {Navigate,Outlet,Route,Routes} from 'react-router-dom';

import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import VerifyEmail from './pages/auth/verify-email';
import EmailVerified from './pages/auth/email-verified';
import Settings from './pages/settings';
import Dashboard from './pages/dashboard';
import Transactions from './pages/transactions';
import AccountsPage from './pages/account-page';
import useStore from './store';
import { setAuthToken } from './libs/apiCall';
import { Toaster } from 'sonner';
import Navbar from './components/navbar';
import { useEffect } from 'react';

const RootLayout = () => {
  const {user, token } = useStore((state)=>state);

  // Initialize auth token on app load
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  return !user?(
    <Navigate to={"/sign-in"} replace={true}/>
  ):(
    <>
      <Navbar/>
      <div className='min-h-[cal(h-screen-100px)]'>
        <Outlet/>
      </div>
    </>
  )
}

function App() {
  const {theme} = useStore((state)=>state);

  useEffect(()=>{
    if(theme==="dark"){
      document.body.classList.add("dark");
    }else{
      document.body.classList.remove("dark");
    }
  },[theme])
  return (
      <main>
        <div className='w-full min-h-screen px-6 bg-gray-100 md:px-20 dark:bg-slate-900'>
        <Routes>
          <Route element={<RootLayout />}>
          {/* <Route> */}
            <Route path='/' element={<Navigate to="/overview" />} />
            <Route path='/overview' element={<Dashboard/>}/>
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/accounts' element={<AccountsPage />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
        </Routes>
        </div>

        <Toaster richColors position='top-center'/>
      </main>
  );
}

export default App
