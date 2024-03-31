import React, { useState } from "react";
import { Input, Select, Table, Radio } from "antd";
import searchImg from "../../assets/search.svg";
import { unparse, parse } from "papaparse";
import { toast } from 'react-toastify';

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  // this function for downloading our csv file or exporting a csv file
  const exportFromCSV = () => {
    // Specifying fields and data explicitly
    var csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    var data = new Blob([csv], { type: "text/csv:charsetutf-8;" });
    const csvURL = window.URL.createObjectURL(data);
    const tempLink = document.createElement("a");
    tempLink.href = csvURL;
    tempLink.download = "transactions.csv";
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };


  const importFromCsv = (event) => {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          // now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Skip this transaction if the 'amount' is not a valid number
            if (isNaN(transaction.amount)) {
              continue;
            }

            const newTransaction = {
              ...transaction,
              // Convert the 'amount' field to a number using parseFloat instead of parseInt
              amount: parseFloat(transaction.amount),
            };
            // Write each transaction to Firebase (addDoc), you can use the addTransaction function here
            await addTransaction(newTransaction, true);
          }
          toast.success("All transactions added");
          fetchTransactions();
          event.target.value = null; // Reset the input field
        },
      });
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div 
    style={{
      padding: "0rem 2rem"
    }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} alt="" width="16" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Select.Option value="">All</Select.Option>
          <Select.Option value="income">Income</Select.Option>
          <Select.Option value="expense">Expense</Select.Option>
        </Select>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "1rem"
      }}>

        <h2>My Transactions</h2>
        <Radio.Group
          className="input-radio"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <Radio.Button value="">No Sort</Radio.Button>
          <Radio.Button value="date">Sort by Date</Radio.Button>
          <Radio.Button value="amount">Sort by Amount</Radio.Button>
        </Radio.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}
        >
          <button
            className="btn"
          onClick={exportFromCSV}
          >
            Export to CSV
          </button>
          <label for="file-csv" className="btn btn-blue">
            Import from CSV
          </label>
          <input
            id="file-csv"
            type="file"
            accept=".csv"
            required
            style={{ display: "none" }}
          onChange={importFromCsv}
          />
        </div>
      </div>
      <Table dataSource={sortedTransactions} columns={columns} />

    </div>
  );
}

export default TransactionTable;
