import React, { useEffect } from 'react'
import "./styles.css"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import userImg from '../../assets/user.png'
function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {

    if (user) {
      navigate('/dashboard')
    }

  }, [user, loading, navigate])

  function logout() {
    try {
      signOut(auth).then(() => {
        navigate('/')
        toast.success("Logged Out Sucessfully !!!")
      }).catch((error) => {
        toast.error(error.message)
      })
    } catch (error) {
      toast.error(error.message)
    }
  }


  return (
    <div className='navbar'>
      <p className='logo'>Financly.</p>
      {
        user && (
          <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
            <img 
              src={user.photoURL ? user.photoURL : userImg}
            height="2rem" width="2rem"
            style={{borderRadius: "50%", height:"2rem", width:"2rem"}}
            alt=""/>
          <p className='link' onClick={logout}>Logout</p>
          </div>
        )

      }
    </div>
  )
}

export default Header