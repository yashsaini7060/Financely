import { Card, Row } from 'antd'
import React from 'react'
import Button from '../Button/index'
import './styles.css'
function Cards({income, expense, totalBalance, showIncomeModal, showExpenseModal}) {
  return (
    <div>
      <Row className='my-row'>

        <Card bordered={true} className='my-card' >
          <h2>Current Balance</h2>
          <p>${totalBalance}</p>
          <Button text='Reset Button' blue='true'/>
        </Card>

        <Card bordered={true} className='my-card' >
          <h2>Total Income</h2>
          <p>${income}</p>
          <Button text='Add Income' blue='true' onClick={showIncomeModal}/>
        </Card>

        <Card bordered={true} className='my-card' >
          <h2>Total Expenses</h2>
          <p>${expense}</p>
          <Button text='Add Expenses' blue='true' onClick={showExpenseModal}/>
        </Card>

      </Row>
    </div>
  )
}

export default Cards