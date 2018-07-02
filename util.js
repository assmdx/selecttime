const data = require("./data.json")

var exports = module.exports;


exports.selectCode = function(){
  //随机从数组中取一个数字，填入数组
  if(data.code.length === 0){
    return -1
  }
  let randomCodeIndex =  parseInt(Math.random()*(data.code.length),10);
  let code = data.code[randomCodeIndex]
  data.code.splice(randomCodeIndex,1)
  return code
}
exports.searchCodeByCS = function(userX){
  const result = data.user.filter(useri => useri.company === userX.company && useri.school === userX.school)
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
