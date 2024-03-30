import React, { useEffect, useState } from 'react';
import Header from '../components/Header'
import Cards from '../components/Cards'

import AddIncome from '../components/Modal/addIncome';
import AddExpense from '../components/Modal/addExpense';
import { query, getDocs, addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'
import TransactionTable from '../components/TransactionsTable';

function Dashboard() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false)
  const [user] = useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    console.log("On Finish", values, type)
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name
    }
    addTransaction(newTransaction);

  }

  async function addTransaction(transaction) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      )
      console.log("Document written with ID:", docRef.id);
      toast.success("Transaction Added!!")
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr)
      calculateBalance()
    } catch (error) {

    }
  }

  // ...
  useEffect(() => {
    fetchTransactions();
  }, [user])

  useEffect(() => {
    calculateBalance();
  },[transactions])

  function calculateBalance(){
    let incomeTotal =0;
    let expenseTotal = 0;
    transactions.forEach((transaction) =>{
      if(transaction.type ==="income"){
        incomeTotal+=transaction.amount
      } else{
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal-expenseTotal)
  }


  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      })
      setTransactions(transactionArray);
      console.log("TransactionsArray",transactionArray)
      toast.success("Transactions Fetched!")
    }
    setLoading(false);
  }


  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showIncomeModal={showIncomeModal}
            showExpenseModal={showExpenseModal}
          />
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish} />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions}/>
        </>
      )}
    </div>
  );
}

export default Dashboard