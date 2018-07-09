const db = require('./redisUtil')

// db.set(0,JSON.stringify([0,1])).then((data)=>{
//   console.log('insert data success');
// })
//
db.get('潘佳义').then(data => {
  console.log('get data is',data);
})

// db.delete(0).then(data=>{
//   console.log('delete success',data);
// })

// db.delete(0).then(data =>{
//   console.log('delete data success is',data);
// })
