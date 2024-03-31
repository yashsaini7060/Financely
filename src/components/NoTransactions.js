import React from 'react'
import transaction from '../assets/noTrans.svg'
function NoTransactions() {
  return (
    <div
      style={{
        display:"flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBBottom: "2rem"
      }}
    >

      <img src={transaction} style={{width:"400px", margin: "4rem" }} alt="" />
      <p style={{textAlign: "center", fontSize: "1.2rem"}}>You Have No Transactions Currently</p>
    </div>
  )
}

export default NoTransactions