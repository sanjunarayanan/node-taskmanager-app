const express = require('express');
const router = new express.Router()
const User=require('../models/user')
const auth =require('../middleware/auth')


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


// sign in the user...!
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            res.status(404).send("invalid user")
        }else{
            const token = await user.generateToken()
            res.send({user,token})
        }
        
    } catch (e) {
        res.status(400).send(e)
    }
})

// logout ...
router.post('/users/logout',auth,async(req,res)=>{
   try {
       req.user.tokens = req.user.tokens.filter((token)=>{
           return token.token !==req.token
       })
       await req.user.save()
       res.send("logout successfully..!")

   } catch (error) {
      res.status(500).send() 
   }
})

// logout all...
router.post('/users/logoutAll',auth,async(req,res)=>{
   try {
       req.user.tokens = []
       await req.user.save()
       res.send("successfuly loggingout..!")
   } catch (error) {
       res.send("error")
   }
})


// read all user
router.get('/users/me',auth,async(req,res)=>{
  try {
      res.send(req.user)  
  } catch (error) {
      res.status(500).send(error)
  } 
})



//update by id 

router.patch('/users/me',auth,async(req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdate = ['age','name','email','password']
  const isAllowed = updates.every((update)=>allowedUpdate.includes(update))
  if( !isAllowed) {
      return res.status(400).send({error:'The Update is Invalid'})
  }else{
      try {
           updates.forEach( (update)=>req.user[update] = req.body[update] )
           await req.user.save()
           res.status(200).send(req.user)
      } catch (error) {
          res.status(404).send(error)
      }
  }
  
})


// delete user 
router.delete('/users/me',auth,async(req,res)=>{
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (error) {
      res.status(500).send(error)
  }
})



module.exports=router