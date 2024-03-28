import React, { useState } from 'react';
import Header from '../components/Header'
import Cards from '../components/Cards'
import { Modal } from 'antd';
import AddIncome from '../components/Modal/addIncome';
import AddExpense from '../components/Modal/addExpense';


function Dashboard() {
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsExpenseModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, types) => {
    console.log("On Finish", values, types)
  }
  return (
    <div>
      <Header />
      <Cards 
      showIncomeModal={showIncomeModal}
      showExpenseModal={showExpenseModal}
      />
      <Modal visible={isIncomeModalVisible} onCancel={handleIncomeCancel} >Income</Modal>
      <Modal visible={isExpenseModalVisible} onCancel={handleExpenseCancel} >Expense</Modal>
      <AddExpense isExpenseModalVisible={isExpenseModalVisible}
      handleExpenseCancel={handleExpenseCancel}
      onFinish={onFinish}/>
      <AddIncome isIncomeModalVisible={isIncomeModalVisible}/>
    </div>
  );
}

export default Dashboard