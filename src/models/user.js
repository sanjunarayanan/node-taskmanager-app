const mongoose= require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required: true,
            trim : true
        },
        email : {
            type : String,
            unique: true,
            required : true ,
            lowercase : true ,
            validate(value) {
                if(!validator.isEmail(value)) {
                    throw new Error("please give a valid email ")
                }
            }
    
        },
        age : {
            type:Number,
            default:0 ,
            validate(value){
                if(value < 0) {
                    throw new Error ('Age must be a positive number !..')
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        avatar : {
            type: Buffer
        },

        tokens : [{
            token : {
                type:String,
                required:true
            }
        }]
    
    },{
        timestamps : true
    })

    userSchema.virtual('tasks', {
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
    })

// toJSON is used for the delete the 
// token and password while user is looged in ..
userSchema.methods.toJSON = function(){
    const  user = this
    const  userObject = user.toObject()
    delete userObject.tokens
    delete userObject.password
    delete userObject.avatar
    return userObject
}

// logeed..

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// generate tokenn..

userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign( {_id:user._id.toString()},'sanjudilna')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}



// Hash the plain text password..
userSchema.pre('save', async function(next){
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Delete the user as well as associated task 


userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
})

const User = mongoose.model('user',userSchema)
module.exports=User ;