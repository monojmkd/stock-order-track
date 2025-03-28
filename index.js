const express = require('express');
const {
  getAllStocks,
  getStockByTicker,
  validateStock,
  addTrade,
} = require('./stock');
const app = express();
app.use(express.json());

app.get('/stocks', async (req, res) => {
  const stocks = await getAllStocks();
  if (stocks.length === 0) {
    return res.status(404).json({ message: 'No Stocks Found.' });
  }
  res.json(stocks);
});

app.get('/stocks/:ticker', async (req, res) => {
  const stock = await getStockByTicker(req.params.ticker);
  if (!stock) {
    return res.status(404).json({ error: 'Stock not found.' });
  }
  res.json(stock);
});

app.post('/trades/new', async (req, res) => {
  let error = validateStock(req.body);
  if (error) {
    return res.status(400).send(error);
  }
  let addedTrade = await addTrade(req.body);
  res.status(201).json(addedTrade);
});

module.exports = { app };
