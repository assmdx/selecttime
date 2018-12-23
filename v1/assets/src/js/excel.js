var idTmr;

function getExplorer() {
  var explorer = window.navigator.userAgent;
  if (explorer.indexOf("MSIE") >= 0 || (explorer.indexOf("Windows NT 6.1;") >= 0 && explorer.indexOf("Trident/7.0;") >= 0)) {
    return 'ie'; //ie
  } else if (explorer.indexOf("Firefox") >= 0) {
    return 'Firefox'; //firefox
  } else if (explorer.indexOf("Chrome") >= 0) {
    return 'Chrome'; //Chrome
  } else if (explorer.indexOf("Opera") >= 0) {
    return 'Opera'; //Opera
  } else if (explorer.indexOf("Safari") >= 0) {
    return 'Safari'; //Safari
  }
}

//此方法为ie导出之后,可以保留table格式的方法
function getIEsink(tableid) {
  var curTbl = document.getElementById(tableid);
  if (curTbl == null || curTbl == "") {
    alert("没有数据");
    return false;
  }
  var oXL;
  try {
    oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
  } catch (e) {
    alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
    return false;
  }

  var oWB = oXL.Workbooks.Add();
  var oSheet = oWB.ActiveSheet;
  var sel = document.body.createTextRange();
  sel.moveToElementText(curTbl);
  sel.select();
  sel.execCommand("Copy");
  oSheet.Paste();
  oXL.Visible = true;
}

//此方法为ie导出之后,不保留table格式的方法
function getIEnotsink(tableid) {
  var curTbl = document.getElementById(tableid);
  if (curTbl == null || curTbl == "") {
    alert("没有数据");
    return false;
  }
  var oXL;
  try {
    oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel
  } catch (e) {
    alert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，" + "那么请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
    return false;
  }

  var oWB = oXL.Workbooks.Add();
  var oSheet = oWB.ActiveSheet;
  var Lenr = curTbl.rows.length;
  for (i = 0; i < Lenr; i++) {
    var Lenc = curTbl.rows(i).cells.length;
    for (j = 0; j < Lenc; j++) {
      oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
    }
  }
  oXL.Visible = true;
}

function getImport(tableid) {
  if (getExplorer() == 'ie') {
    getIEnotsink(tableid);
  } else {
    tableToExcel(tableid);
  }
}

function Cleanup() {
  window.clearInterval(idTmr);
  CollectGarbage();
}
var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g,
        function(m, p) {
          return c[p];
        })
    }
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {
      worksheet: name || 'Worksheet',
      table: table.innerHTML
    }
    window.location.href = uri + base64(format(template, ctx))
  }
})()
