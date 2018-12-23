//打表
const data = require('./data.json')
let produceCode = (obj,key,value) => {obj[key] = value}
let codeMap = {}
for(let i = 0 ;i < data.maxCode ; i ++) {
    produceCode(codeMap,data.ceoList[i].ceo,data.codeBox[i])
}

var express = require('express')
var bodyParser = require('body-parser')
var app = express()
//抽号
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.post('/select', (req, res) => {
    let ceo = req.body.ceo
    res.json({
        code: codeMap[ceo]
    })
})
app.listen(22020, function () {})