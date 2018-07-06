const express = require('express')
var process = require('process')
const bodyParser = require('body-parser')
const util = require('./util')
var app = express()
const port = (function () {
  if (typeof (process.argv[2]) !== 'undefined') { // 如果输入了端口号，则提取出来
    if (isNaN(process.argv[2])) { // 如果端口号不为数字，提示格式错误
      throw 'Please write a correct port number.'
    } else { // 如果端口号输入正确，将其应用到端口
      return process.argv[2]
    }
  } else { // 如果未输入端口号，则使用下面定义的默认端口
    return 22020
  }
})()


app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.use(express.static('assets/dist'));
app.use(express.static('assets/src'));

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


//默认页面
app.get('/', function(req, res) {
  res.type('.html');
  res.sendFile(__dirname + "/assets/dist/" + "index.html");

})
//抽号
app.post('/select', function(req, res) {
  // console.log(req.body)
  let school = req.body.school
  let company = req.body.company
  let phoneNum = req.body.phoneNum
  let ceo = req.body.ceo
  let findIsExist = util.searchCodeByCS({
    ceo: ceo,
    company: company
  })

  let code
  let group
  let id
  let day
  if (findIsExist.length === 0) {
    code = util.selectCode()
    //判断号箱为空的情况

    if(code === -1){
      res.json({
        code: -1,
        group: -1,
        day: -1,
        id: -1
      })
    }

    group = code % 65 === 0 ? code / 65 : Math.floor(code / 65 + 1)
    day = code % 65===0 ? 2 : (code % 65 > 33 ? 2 : 1)
    id = code % 65 === 0 ? 65 : code - (Math.floor(code / 65)) * 65
    if (day === 2) {
      id = id - 33
    }
    util.saveUserDataAndCode({
      code: code,
      group: group,
      day: day,
      id: id,
      school: school,
      company: company,
      ceo: ceo,
      phoneNum: phoneNum
    }).catch(e){
      console.error('save user data failed',e)
    }
  } else {
    code = findIsExist[0].code
    group = findIsExist[0].group
    id = findIsExist[0].id
    day = findIsExist[0].day
  }

  res.json({
    code: code,
    group: group,
    day: day,
    id: id
  })
})

//检查是否有这个负责人
app.post('/checkCeoName', function(req, res) {
  let findCeoIsExist = util.searchCeo(req.body.ceo)
  if(findCeoIsExist.length === 0){
    res.json({
      res:false
    })
  }
  else{
    res.json({
      res:true
    })
  }
})

//重置号码箱
app.post('/reset', function(req, res) {
  util.clearCode().catch(e=>{
    console.error('reset failed',e)
  })
  res.end('ok')
})


//查看抽号情况
app.get('/count', function(req, res) {
  res.sendFile(__dirname + "/assets/src/" + "count.html");
})
app.get('/countData', function(req, res) {
  util.getUserData().then(data => {
    res.json(data)
  }).catch(e=>{
    console.error('get count data failed',e);
  })
})


app.listen(port, function () {
  console.log('Example app listening on port ' + port + ' !')
})
