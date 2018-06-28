const express = require('express')
const bodyParser = require('body-parser')
const util = require('./util')
const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(express.static('assets'));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


//默认页面
app.get('/',function(req,res){
   res.sendFile( __dirname + "/assets/" + "index.html" );
})

//抽号
app.post('/select', function (req, res) {
  console.log(req.body)
   let school = req.body.school
   let company = req.body.company
   let phoneNum = req.body.phoneNum
   let ceo = req.body.ceo
   let findIsExist = util.searchCodeByCS({
     school:school,
     company:company
   })

   let code
   let group
   let id
   let day
   if(findIsExist.length === 0){
     code = util.selectCode()
     group = code % 65 === 0 ? code / 65 : Math.floor(code/ 65 + 1)
     day = code % 65 > 32 ?  2 : 1
     id = code % 65 === 0 ? 65 : code - (Math.floor(code / 65 )) * 65
     if(day === 2){
       id = id - 32
     }
     util.saveUserDataAndCode({
       code:code,
       group:group,
       day:day,
       id:id,
       school:school,
       company:company,
       ceo:ceo,
       phoneNum:phoneNum
     })
   }
   else {
     code = findIsExist[0].code
     group = findIsExist[0].group
     id = findIsExist[0].id
     day = findIsExist[0].day
   }

   res.end(JSON.stringify({
     code:code,
     group:group,
     day:day,
     id:id
   }))
})

//重置号码箱
app.post('/reset',function(req,res){
  util.clearCode()
  res.end('ok')
})

//查看抽号情况
app.get('/count',function(req,res){
  res.sendFile( __dirname + "/assets/" + "count.html" );
})

app.get('/countData',function(req,res){
  res.end(JSON.stringify(util.getUserData()))
})

//获取控制台页面
app.get('/manage',function(req,res){
  res.sendFile( __dirname + "/assets/" + "manage.html" );
})

var server = app.listen(22020, function () {})
