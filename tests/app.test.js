let {
  getAllStocks,
  getStockByTicker,
  addTrade,
  validateStock,
} = require('../stock.js');
let { app } = require('../index.js');
let http = require('http');
let request = require('supertest');

jest.mock('../stock.js', () => ({
  ...jest.requireActual('../stock.js'),
  getAllStocks: jest.fn(),
  getStockByTicker: jest.fn(),
  addTrade: jest.fn(),
}));
let server;
beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API ENDPOINTS', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Test 1
  it('GET /stocks shoud retrieve all stocks.', async () => {
    const mockStocks = [
      { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
    ];
    getAllStocks.mockResolvedValue(mockStocks);
    const result = await request(server).get('/stocks');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockStocks);
    expect(result.body.length).toBe(3);
  });
  // Test 2
  it('GET /stocks/:ticker shoud retrieve stock by ticker.', async () => {
    const mockStock = {
      stockId: 1,
      ticker: 'AAPL',
      companyName: 'Apple Inc.',
      price: 150.75,
    };
    getStockByTicker.mockReturnValue(mockStock);
    const result = await request(server).get('/stocks/AAPL');
    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(mockStock);
  });
  // Test 3
  it('POST /trades/new should add a new trade', async () => {
    let newTrade = {
      tradeId: 4,
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    };
    addTrade.mockResolvedValue(newTrade);
    const result = await request(server).post('/trades/new').send({
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(newTrade);
  });
  // Test 4
  it('GET /stocks/:ticker should return 404 for invalid ticker.', async () => {
    getStockByTicker.mockResolvedValue(null);
    const result = await request(server).get('/stocks/XYZ');
    expect(result.statusCode).toEqual(404);
    expect(result.body.error).toEqual('Stock not found.');
  });
});

describe('Validation Functions', () => {
  // Test 5
  it('should validate trade input', () => {
    expect(
      validateStock({
        stockId: 1,
        quantity: 15,
        tradeType: 'buy',
        tradeDate: '2024-08-08',
      })
    ).toBe(null);
    expect(
      validateStock({
        quantity: 15,
        tradeType: 'buy',
        tradeDate: '2024-08-08',
      })
    ).toBe('Stock Id is required and should be a number');
    expect(
      validateStock({
        stockId: 1,
        tradeType: 'buy',
        tradeDate: '2024-08-08',
      })
    ).toBe('Quantity is required and should be a number');
    expect(
      validateStock({
        stockId: 1,
        quantity: 15,
        tradeDate: '2024-08-08',
      })
    ).toBe('Trade Type is required and should be a string');
    expect(
      validateStock({
        stockId: 1,
        quantity: 15,
        tradeType: 'buy',
      })
    ).toBe('Trade Date is required and should be a string');
  });
});

describe('Mock Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should return all stocks', () => {
    let mockStocks = [
      { stockId: 1, ticker: 'AAPL', companyName: 'Apple Inc.', price: 150.75 },
      {
        stockId: 2,
        ticker: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2750.1,
      },
      { stockId: 3, ticker: 'TSLA', companyName: 'Tesla, Inc.', price: 695.5 },
    ];
    getAllStocks.mockReturnValue(mockStocks);
    let result = getAllStocks();
    expect(result).toEqual(mockStocks);
    expect(getAllStocks).toHaveBeenCalled();
  });
  it('should add a new trade', () => {
    let newTrade = {
      stockId: 1,
      quantity: 15,
      tradeType: 'buy',
      tradeDate: '2024-08-08',
    };
    addTrade.mockReturnValue(newTrade);
    let result = addTrade(newTrade);
    expect(result).toEqual(newTrade);
    expect(addTrade).toHaveBeenCalledWith(newTrade);
  });
});
