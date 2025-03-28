let stocks = [
  { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
  { stockId: 2, ticker: 'GOOGL', companyName: 'Alphabet Inc.', price: 2750.1 },
  { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
];

let trades = [
  {
    tradeId: 1,
    stockId: 1,
    quantity: 10,
    tradeType: 'buy',
    tradeDate: '2024-08-07',
  },
  {
    tradeId: 2,
    stockId: 2,
    quantity: 5,
    tradeType: 'sell',
    tradeDate: '2024-08-06',
  },
  {
    tradeId: 3,
    stockId: 3,
    quantity: 7,
    tradeType: 'buy',
    tradeDate: '2024-08-05',
  },
];

function getAllStocks() {
  return stocks;
}

function getStockByTicker(ticker) {
  return stocks.find((stock) => stock.ticker === ticker);
}

function validateStock(stock) {
  if (!stock.stockId || typeof stock.stockId !== 'number') {
    return 'Stock Id is required and should be a number';
  }

  if (!stock.quantity || typeof stock.quantity !== 'number') {
    return 'Quantity is required and should be a number';
  }

  if (!stock.tradeType || typeof stock.tradeType !== 'string') {
    return 'Trade Type is required and should be a string';
  }
  if (!stock.tradeDate || typeof stock.tradeDate !== 'string') {
    return 'Trade Date is required and should be a string';
  }

  return null;
}

function addTrade(trade) {
  let newTrade = { tradeId: trades.length + 1, ...trade };
  trades.push(newTrade);
  return newTrade;
}

module.exports = { getAllStocks, getStockByTicker, addTrade, validateStock };
