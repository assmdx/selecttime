const data = require("./data.json")
const db = require('./redisUtil')

var exports = module.exports;


exports.selectCode = async function(){
  //随机从数组中取一个数字，填入数组
  let codeBoxStr = await db.get('codeBox').then(data=>data).catch(e=>e)
  let codeBox = JSON.parse(codeBoxStr)
  if(codeBox.length === 0){
    return -1
  }
  let randomCodeIndex =  parseInt(Math.random()*(codeBox.length),10);
  let code = codeBox[randomCodeIndex]
  codeBox.splice(randomCodeIndex,1)
  await db.set('codeBox',JSON.stringify(codeBox))
  return code
}

//若是团队名称相同或者负责人名字相同返回相同的结果
exports.searchCodeByCS = async function(userX){
  let resStr = await db.get(userX.ceo).then(data =>data).catch(e=>e)
  return JSON.parse(resStr)
}

//在负责人列表中寻找匹配的负责人
exports.searchCeo = function(ceoName){
  const result = data.ceoList.filter(ceoi => ceoi.ceo === ceoName)
  return result
}

exports.saveUserDataAndCode = function(userX){
  return db.set(userX.ceo,JSON.stringify(userX))
}

exports.clearCode = function(){
  db.set('codeBox',JSON.stringify(data.codeBox))
  for(let i = 0;i < data.maxCode ;i++ ){
    db.delete(data.ceoList[i].ceo).then().catch(e =>{
      console.error('delete user data error',e);
    })
  }
}

//排序好的抽号情况
exports.getUserData = function(){
  let user = []
  return new Promise((resolve,reject)=>{
    for(let i = 0;i<data.maxCode;i++){
      db.get(data.ceoList[i].ceo).then(userX => {
        if(null != userX){
          user.push(JSON.parse(userX))
        }
        if(i === data.maxCode - 1){
          resolve(user)
        }
      }).catch(e =>{
        console.error('get user data error',e);
      })
    }
  })
}
