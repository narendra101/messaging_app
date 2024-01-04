import {Navigate, Outlet} from 'react-router-dom'
import {useState, useEffect} from 'react'
import { getToken } from './Utils';
// import Call from './Utils';




function AuthRoutes() {  
  if(getToken()) {
    return <Outlet />
  } else {
    return <Navigate to="/" replace />
  }
}

export default AuthRoutes