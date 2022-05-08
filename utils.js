// 生产环境域名：http://xxx.com    开发环境域名：http://localhost
const host = "http://localhost";
// 生产环境端口：自定义         开发环境域名：9000
const port = 9000;

// 引入mysql
const mysql = require("mysql");
const jwt = require('jsonwebtoken')
// 创建连接池
const pool = mysql.createPool({
    host: "localhost",  // 连接的服务器(代码托管到线上后，需改为内网IP，而非外网)
    port: 3306, // mysql服务运行的端口
    database: "cms", // 选择某个数据库
    user: "root",   // 用户名
    password: "123456", // 用户密码
})

//对数据库进行增删改查操作的基础
const query = (sql, callback) => {
    pool.getConnection(function (err, connection) {
        connection.query(sql, function (err, rows) {
            callback(err, rows)
            connection.release()
        })
    })
}
/*
    返回信息的结构
    errCode: 0代表成功，1代表参数错误，2代表其他错误
    message: 请求结果信息，
    data: 返回前端的数据
 */

const returnMsg = (errCode, message, data) => {
    return {
        errCode: errCode || 0,
        message: message || "",
        data: data || {}
    }
}

/*
    数据库操作Promise封装
 */
const queryFn = (sql) => {
    return new Promise((resolve, reject) => {
        query(sql, (err, rows) => {
            if (err) reject(err); // []
            resolve(rows) // [{}]
        })
    })
}

//鉴权函数
const jwtVerify = (token) => {
    try {
        //解密token，得到username和password
        jwt.verify(token, 'miyao')
    } catch (err) {
        //鉴权失败
        return false;
    }
    return true;
}


module.exports = {
    host, port, returnMsg, queryFn, jwtVerify
}
