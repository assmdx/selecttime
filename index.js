const express = require('express')
const bodyParser = require('body-parser')
const util = require('./util')
var app = express()
const fs  = require('fs');
const xlsx = require('node-xlsx')

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
  console.log('sadhasjkhdkashd');
  console.log(__dirname + "\\assets\\dist\\" + "index.html");
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
      res.end(JSON.stringify({
        code: -1,
        group: -1,
        day: -1,
        id: -1
      }))
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
    })
  } else {
    code = findIsExist[0].code
    group = findIsExist[0].group
    id = findIsExist[0].id
    day = findIsExist[0].day
  }

  res.end(JSON.stringify({
    code: code,
    group: group,
    day: day,
    id: id
  }))
})

//检查是否有这个负责人
app.post('/checkCeoName', function(req, res) {
  let findCeoIsExist = util.searchCeo(req.body.ceo)
  if(findCeoIsExist.length === 0){
    res.end(JSON.stringify({
      res:false
    }))
  }
  else{
    res.end(JSON.stringify({
      res:true
    }))
  }
})

//重置号码箱
app.post('/reset', function(req, res) {
  util.clearCode()
  res.end('ok')
})


//查看抽号情况
app.get('/count', function(req, res) {
  res.sendFile(__dirname + "/assets/src/" + "count.html");
})
app.get('/countData', function(req, res) {
  res.end(JSON.stringify(util.getUserData()))
})

app.get('/download', function(req, res) {
  let data = JSON.stringify(util.getUserData())
  let buffer = xlsx.build([{
    name: 'test',
    data: data
  }]);
  let xlsxContentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; // For Excel2007 and above .xlsx files

  res.setHeader('Content-Type', xlsxContentType);
  res.setHeader('Content-Disposition', `attachment; filename=${xlsxFileName}.xlsx`);
  res.writeHead(200);
  res.end(buffer);
})


var server = app.listen(22020, function() {})
