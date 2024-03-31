import React from 'react'
import { Line, Pie } from '@ant-design/charts';

function Charts({sortedTransactions}) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount }
  })
  
  let spendingData = sortedTransactions.filter((transaction) => {
    if(transaction.type === "expense"){
      return {tag: transaction.tag, amount: transaction.amount}
    }
    return null
  })

  // let finalSpending = spendingData.reduce((acc, obj) => {
  //   let key = obj.tag;
  //   if(!acc[key]){
  //     acc[key] = {tag: obj.tag, amount: obj.amount};
  //   } else {
  //     acc[key].amount += obj.amount
  //   }
  //   return acc;
  // }, {})

  let newSpendings =[{tag:"food",amount:0},{tag:"education", amount:0},{tag:"food", amount:0}]
  spendingData.forEach((item) => {
    if(item.tag === "food"){
    newSpendings[0].amount += item.amount;
    } else if(item.tag === "education"){
      newSpendings[1].amount += item.amount;
    }else{
      newSpendings[2].amount += item.amount;
    }

  });



  const config = {
    data:data,
    width: 1500,
    height: 400,
    autoFit: false,
    xField: 'date',
    yField: 'amount',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };


  const spendingConfig = {
    data: spendingData,
    width: 500,
    autoFit: true,
    xField: "date",
    yField: "amount",
  }

  let chart;
  let piechart;


  return (
    <div className="chart-wrapper">
      <div>
        <h2>Your Analytics</h2>
          <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
      </div>
      <div>
        <h2>Your Spendings</h2>
        <Pie {...spendingConfig} 
          onReady={(chartInstance) => (piechart = chartInstance)}
        />
      </div>
    </div>

  )
}

export default Charts