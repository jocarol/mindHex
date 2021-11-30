const express = require('express');
const app = express();

// Set application header to accept application/json
app.use(function (req: any, res: { header: (arg0: string, arg1: string) => void; }, next: () => void) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json())

const logicRouter = require('./route/logic')

app.use('/', logicRouter);
app.listen(3000, () => {
  console.log('Listening on port 3000');
});