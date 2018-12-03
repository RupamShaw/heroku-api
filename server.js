
const express = require('express');
const app = express();
var requestHandlers = require("./requestHandlers");

app.get('/', (req, res) => {
   //debugger;
   res.send('Hello World!')
})
// app.post('/login', function(req, res){
//     console.log(Users);
//     if(!req.body.id || !req.body.password){
//        res.render('login', {message: "Please enter both id and password"});
//     } else {    
//        Users.filter(function(user){
//           if(user.id === req.body.id && user.password === req.body.password){
//              req.session.user = user;
//              res.redirect('/protected_page');
//           }
//        });
//        res.render('login', {message: "Invalid credentials!"});
//     }
//  });
// Route path: /users/:userId/books/:bookId
// Request URL: http://localhost:3000/users/34/books/8989
// req.params: { "userId": "34", "bookId": "8989" }
app.post('/login', function (req, res) {
   debugger;
   requestHandlers.login(res, req.query);
});

console.log('ppppp', process.env.PORT)
app.listen(5555, () => console.log(`check app listening on port 5555!`))