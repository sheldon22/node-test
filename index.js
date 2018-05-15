var http = require('http')
var fs = require('fs')
var url = require('url')

// console.log(Object.keys(http))
// SRJ Server Rendered Javascript 服务器返回的Javascript. 在AJAX出现之前使用的无刷新局部更新页面内容的方法
var port = process.env.PORT || 8888;

var server = http.createServer(function(request, response){
  var temp = url.parse(request.url, true)
  var path = temp.pathname
  var query = temp.query
  var method = request.method
  // 2005年前--前后端配合方法
  if(path === '/'){   // 如果用户请求的是 / 路径
    var string = fs.readFileSync('./index.html', 'utf8')
    // 1. 添加文件数据库
    var amount = fs.readFileSync('./db.txt', 'utf8')
    string = string.replace('$$$amount$$$', amount)
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write(string)
    response.end()
  }else if(path === '/style.css'){
    var string = fs.readFileSync('./style.css', 'utf8')
    response.setHeader('Content-Type', 'text/css')
    response.write(string)
    response.end()
  }else if(path === '/main.js'){
    var string = fs.readFileSync('./main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript')
    response.write(string)
    response.end()
  }
  // 2. 添加关于pay路径的响应, 点pay后强制付款1元. 
  else if(path === '/pay'){     
    var amount = fs.readFileSync('./db.txt', 'utf8')
    var newAmount = amount - 1
  // 3. 模拟失败场景
    if(Math.random() < 0.9){
      fs.writeFileSync('./db.txt', newAmount)
      response.setHeader('Content-Type', 'application/javascript')
      // 判断付款状态
      response.statusCode = 200
      response.write('amount.innerText = amount.innerText - 1')
    }else{
      response.statusCode = 400
    }
    response.end()
  }else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end('找不到对应的路径,请自行修改 index.js')
  }
  console.log(method + '' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n打开 http://localhost:' + port)