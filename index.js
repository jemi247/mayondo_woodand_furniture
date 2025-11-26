// 1. Dependencies
const express = require('express');

// 2. Instantiations
const app = express();

// 3. Configurations

// 4. Middlewares
app.use((req, res, next) =>{
  console.log('A new request received at ' + Date.now());
  next();
});

// To parse URL encoded data
app.use(express.urlencoded({extended : false}));

// // Simple request time logger for a specific route
// app.use('/home',(req, res, next) => {
//   console.log('A new request received at', Date.now());
//   next();
// });

// 5. Routes
app.get('/', (req, res) => {
  res.send('Homepage. Hello World!');
});

app.get('/about', (req, res) => {
  res.send('About page. Nice.');
});

app.post('/user', (req, res) => {
  res.send('User added.');
});

app.put('/user', (req, res) => {
  res.send('User updated.');
});

app.delete('/user', (req, res) => {
  res.send('User deleted.');
});

app.get('/',(req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//path parameters
app.get('/users/:name', (req, res)=> {
  res.send(req.params.name + ' is returned from the database.');
});

//query parameters
app.get('/student', (req, res) => {
  res.send('You searched for ' + req.query.name + 'from' + req.query.class + 'in' + req.query.cohort);
});

// handling non-existent routes
app.use((req, res) => {
  res.status(404).send('Oops! Route Not Found.');
});

// 6. Bootstrapping server
//should always be the last line in your file
app.listen(3000, () => console.log('listening on port 3000'));
