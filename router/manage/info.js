// 用户信息接口 (查询、修改)
const Router = require("koa-router")
const router = new Router();
const { returnMsg, queryFn, jwtVerify } = require('../../utils')
const jwt = require('jsonwebtoken')

// 查询用户信息
router.get('/', async ctx => {
    //获取token,前端请求头携带过来的token
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    //数据库查询token对应用户
    let sql = `SELECT username,token,avatar FROM user WHERE token='${token}'`;
    let result = await queryFn(sql); //返回数组[{}]
    let obj = {
        username: result[0].username,
        'cms-token': result[0].token,
        avatar: result[0].avatar,
    }
    ctx.body = obj; //取数组里的对象{}
})

//修改用户信息
router.post('/', async ctx => {
    //获取token,前端请求头携带过来的token
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    //鉴权成功，修改数据库中对应的字段
    let { username, password } = ctx.request.body;
    // 先检索数据库中用户是否重复
    let sql3 = `SELECT * FROM user WHERE username='${username}'`;
    let result3 = await queryFn(sql3);
    if(result3.length>0){
        ctx.body = returnMsg(1, "用户名已经存在");
        return;
    }
    //最好要求前端强制要求传
    //或者后端自己先去获取token对应的用户名和密码
    /*
        1.可以通过检索数据库获取username和password的旧值
        2.通过jwt去获取username和password旧值
    */
    let sql2 = `SELECT username,password FROM user WHERE token='${token}'`;
    let result2 = await queryFn(sql2);

    let sql1 = `UPDATE user SET username='${username || result2[0].username}',password='${password || result2[0].password}' WHERE token='${token}'`;
    await queryFn(sql1);
    //重新查询当前用户的数据，返回给前端
    let sql = `SELECT username,avatar,token FROM user WHERE token='${token}'`;
    let result = await queryFn(sql);
    let obj = {
        username: result[0].username,
        'cms-token': result[0].token,
        avatar: result[0].avatar,
    }
    ctx.body = returnMsg(0, "修改成功", obj);
})

module.exports = router;