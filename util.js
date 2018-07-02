const data = require("./data.json")

var exports = module.exports;


exports.selectCode = function(){
  //随机从数组中取一个数字，填入数组
  if(data.code.length === 0){
    console.log(data.code);
    return -1
  }
  let randomCodeIndex =  parseInt(Math.random()*(data.code.length),10);
  let code = data.code[randomCodeIndex]
  data.code.splice(randomCodeIndex,1)
  return code
}

//若是团队名称相同或者负责人名字相同返回相同的结果
exports.searchCodeByCS = function(userX){
  const result = data.user.filter(useri => useri.company === userX.company || useri.ceo === userX.ceo)
  return result
}

//在负责人列表中寻找匹配的负责人
exports.searchCeo = function(ceoName){
  const result = data.ceoList.filter(ceoi => ceoi.ceo === ceoName)
  return result
}

exports.saveUserDataAndCode = function(userX){
  data.user.push(userX)
}

exports.clearCode = function(){
  data.user = []
  data.code = []
  let i = 1
  while(i <= data.maxCode){
    data.code.push(i)
    i++
  }
}

//排序好的抽号情况
exports.getUserData = function(){
  return data.user.sort((a,b) => {
    if(a.day === b.day){
      return a.code - b.code
    }
    else {
      return a.day - b.day
    }
  })
}
