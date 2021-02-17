const express = require('express');
const router = new express.Router()
const User=require('../models/user')
const auth =require('../middleware/auth')
const multer = require('multer');
const { get } = require('mongoose');
const sharp = require('sharp')
const {sendWelocomeEmail,sendCancellationEmail} = require('../emails/account')

// create user
router.post('/users',async (req,res)=>{
    const user= new User(req.body)
    try {
        await user.save()
        sendWelocomeEmail(user.email,user.name)
        const token = await user.generateToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(500).send(error)
    }
})


// login.....!
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if(!user){
            res.status(404).send("invalid user")
        }else{
            const token = await user.generateToken()
            res.send({user,token})
            res.send("login successfully..!")
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


// read profile..
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
    sendCancellationEmail(req.user.email,req.user.name)
    res.send(req.user)
  } catch (error) {
      res.status(500).send(error)
  }
})

// upload the avatar
const upload = multer({
    limits : {
        fileSize :1000000,
    },
    fileFilter(req,file,cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
           return cb(new Error('please upload a jpg or jpeg or png..!'))
        }else {
           cb(undefined,true)
        }
     }
})
 
router.post('/user/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:500,height:500}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.delete('/user/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send("profile deleted successfully..!")
})

router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.send(error)
    }
    
})



module.exports=router