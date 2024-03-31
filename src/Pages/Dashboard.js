import React, { useEffect, useState, useCallback } from 'react';

import Header from '../components/Header'
import Cards from '../components/Cards'

import AddIncome from '../components/Modal/addIncome';
import AddExpense from '../components/Modal/addExpense';
import { query, getDocs, addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase'
import TransactionTable from '../components/TransactionsTable';
import Charts from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

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

  const calculateBalance = useCallback(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);
  

  const fetchTransactions = useCallback(async () => {
    if (user) {
      const dataRef = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(dataRef);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push({ ...doc.data(), id: doc.id });
      });
      setTransactions(transactionArray);
      console.log("Transaction Array",transactionArray)
      toast.success("Transaction Fetched!");
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [user, fetchTransactions]);

  useEffect(() => {
    
    calculateBalance();
  },[transactions, calculateBalance])

  let sortedTransactions = transactions.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
  });
  console.log(sortedTransactions)

//   function sortByDate(array) {
//     // Convert date strings to standard format (YYYY-MM-DD)
//     array.forEach(item => {
//         let parts = item.date.split("-");
//         if (parts.length === 3) {
//             item.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
//         }
//     });

//     // Sort the array based on the date
//     array.sort((a, b) => {
//         return new Date(a.date) - new Date(b.date);
//     });

//     // Convert date back to original format if needed
//     array.forEach(item => {
//         let parts = item.date.split("-");
//         if (parts.length === 3) {
//             item.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
//         }
//     });

//     return array;
// }

// // Usage example
// const sortedTransactions = sortByDate(transactions);





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
          {transactions.length !== 0 ? <Charts sortedTransactions={sortedTransactions}/> : <NoTransactions/>}


          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish} />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        </>
      )}
    </div>
  );
}

export default Dashboard