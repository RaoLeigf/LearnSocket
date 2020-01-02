
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var _ = require('underscore');
// 监听端口
app.listen(3000);
var hashName = new Array();
 
function handler(req, res) {
    fs.readFile(__dirname + '/index2.html',
        function (err, data) {
            res.writeHead(200);
            res.end(data);
        });
}
 
// 通过 emit 和 on 可以实现服务器与客户端之间的双向通信
 
// io.sockets.on('connection', function (socket) { ... }) 的作用是服务器监听所有客户端 并返回该新连接对象
// 这个事件在在客户端与服务器建立链接时自动触发
io.on('connection', function (socket) {
    // 不管是服务器还是客户端都有 emit 和 on 这两个函数，socket.io 的核心就是这两个函数
    socket.on('login', function (data) {
        var name = data.name;
        // // 储存上线的用户
        hashName[name] = socket.id;
    });
    /**
     * on ：用来监听一个 emit 发送的事件
     * 'sayTo' 为要监听的事件名
     * 匿名函数用来接收对方发来的数据
     * 这个匿名函数的第一个参数为接收的数据，如果有第二个参数，则是要返回的函数。
     */
    socket.on('send', function (data) {
        var to = data.to
        var name = data.name
        var word = data.word

        var id = hashName[to]
        if(id){
            var toSocket = _.findWhere(io.sockets.sockets, {id});
            toSocket.emit('message', {
                name,
                to,
                word
            });
        }
    });
 
    // 当关闭连接后触发 disconnect 事件
    socket.on('disconnect', function () {
        console.log('断开一个连接。');
    });
});