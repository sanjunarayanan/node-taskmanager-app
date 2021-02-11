const express = require('express');
require('./db/mongoose.js');
const app=express();
const port = process.env.PORT || 5000;
app.use(express.json());
const userRouter = require('./routers/user')
app.use(userRouter)
const jwt = require('jsonwebtoken')

const myFunction = async ()=>{
   const token = jwt.sign({_id:'abc123'},'sanjudilna',{expiresIn:'1 second'})
   console.log(token);
   const data = jwt.verify(token,'sanjudilna')
   console.log(data)
}

//myFunction()


app.listen(port,()=>{
   console.log("connecting to the port "+port)
})