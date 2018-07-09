var redis = require('redis')
var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


const client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

//存储数据
exports.set = function(key,value){
  return client.multi().set(key,value).execAsync()
}

//获取数据
exports.get = async function(key){
  return client.getAsync(key)
}

//删除数据
exports.delete = function(key){
  return client.multi().del(key).execAsync()
}
