window.onload=function(){document.getElementById('res-container').style.display="none";}
const rooturl='../';const selectCodeUrl='select';function selectCode(){if(!checkPhoneNum()){alert('请输入正确的手机号码');return;}
    if(checkContentIsNull()){alert('请输入公司,学校名称和负责人');return;}
    fetch(rooturl+selectCodeUrl,{method:'POST',cache:"force-cache",headers:{"Content-Type":"application/json; charset=utf-8",},body:JSON.stringify({ceo:getDomValue('ceo')})}).then(function(response){response.json().then(function(data){let code=data.code;if(code===0){alert('请输入正确的信息');}else{let group=1;let address='6层611';let day='7月6日 星期五 ';let idOfDayAndGroup=22;let timeInDay='下午';document.getElementById('codeResult').innerText=group+'组 '+idOfDayAndGroup+' 号 ';document.getElementById('dateResult').innerText=day+''+timeInDay;document.getElementById('addressResult').innerText=address;document.getElementById('container').style.display="none";document.getElementById('res-container').style.display="";}}).catch(function(error){alert('网络连接缓慢,请稍后再试');});}).catch(function(myJson){alert('网络连接缓慢，请稍后再试');});}
function checkContentIsNull(){if(getDomValue('company')===""||getDomValue('school')===""||getDomValue('ceo')===""){return true;}
    return false;}
function checkPhoneNum(){return /^1[0-9]{10}$/.test(getDomValue('phoneNum'));}
function getDomValue(id){return document.getElementById(id).value;}