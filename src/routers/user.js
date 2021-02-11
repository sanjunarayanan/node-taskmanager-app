const express = require('express');
const router = new express.Router()
const User=require('../models/user')

// create user
router.post('/users',async (req,res)=>{
  const user= new User(req.body)
  try {
      await user.save()
      const token = await user.generateToken()
      res.status(201).send({user,token})
  } catch (error) {
      res.status(500).send(error)
  }
})


// read all user
router.get('/users',async(req,res)=>{
  try {
      const users = await User.find({});
      res.send(users)  
  } catch (error) {
      res.status(500).send(error)
  } 
})


//read  user by id
router.get('/user/:id',async (req,res)=>{
  try {
      const _id = req.params.id
      const user = await User.findById(_id);
      if(!user){
          res.status(404).send()
      }else{
        res.send(user)
      }

  } catch (error) {
      res.status(500).send(error)
  } 
})

//update by id 

router.patch('/users/:id' , async(req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdate = ['age','name','email','password']
  const isAllowed = updates.every((update)=>allowedUpdate.includes(update))
  if( !isAllowed) {
      return res.status(400).send({error:'The Update is Invalid'})
  }else{
      try {
           const user = await User.findByIdAndUpdate(req.params.id)
           updates.forEach((update)=>user[update]=req.body[update])
           await user.save()
          if(!user){
              res.status(404).send()   
          }else {
              res.status(500).send(user)
          }
      } catch (error) {
          res.status(404).send(error)
      }
  }
  
})


// delete user 
router.delete('/users/:id',async (req,res)=>{
  try {
     const user = await User.findByIdAndDelete(req.params.id) 
     if(!user){
         return res.status(404).send({error:"user is not there..!"})
     }else {
        res.status(200).send(user)
     }
  } catch (error) {
      res.status(500).send(error)
  }
})

// sign in the user...!
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports=router