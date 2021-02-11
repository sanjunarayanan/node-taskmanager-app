require('../src/db/mongoose')
const User = require('../src/models/user')
// User.findByIdAndUpdate('6022439200226f03f41ba8f4',{age:10 }).then((user)=>{
//   console.log(user)
//   return User.countDocuments({age:10})
// }).then((result)=>{
//   console.log(result)
// }).catch((error)=>{
//   console.log(error)
// })

const updateAndCount = async (id,age) =>{
  const user = await User.findByIdAndUpdate(id,{age})
  const count = await User.countDocuments({age:10})
  return count ;
}

updateAndCount('602243d900226f03f41ba8f5',10).then((result)=>{
  console.log(result);
}).catch((e)=>{
  console.log(e)
})
