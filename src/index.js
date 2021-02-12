const express = require('express');
require('./db/mongoose.js');
const app=express();
const port = process.env.PORT || 5000;
app.use(express.json());
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
app.use(userRouter)
app.use(taskRouter)
app.listen(port,()=>{
   console.log("connecting to the port "+port)
})