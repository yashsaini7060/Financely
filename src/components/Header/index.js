import React, { useEffect } from 'react'
import "./styles.css"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';

function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {

    if(user){
      navigate('/dashboard')
    }

  },[user, loading])

  function logout(){
    try {
      signOut(auth).then(() => {
        navigate('/')
        toast.success("Logged Out Sucessfully !!!")
      }).catch((error) => {
        toast.error(error.message)
      } )
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='navbar'>
      <p className='logo'>Financly.</p>
      {
        user && (
      <p className='link' onClick={logout}>Logout</p>
        )

      }
    </div>
  )
}

export default Header