import React from 'react'
import './styles.css'
function Input({label, type,state, setState, placeholder}) {
  return (
    <div className='input-wrapper'>
      <p className="label-input">{label}</p>
      <input  
        type={type}
        value={state} 
        placeholder={placeholder}
        onChange={(e)=> setState(e.currentTarget.value)} 
        className="custom-input" />
    </div>
  )
}

export default Input