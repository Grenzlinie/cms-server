const Router = require("koa-router")
const router = new Router();
const jwt = require('jsonwebtoken')
const { returnMsg, queryFn} = require('../../utils')

router.post('/', async (ctx) => {
    console.log(ctx.request.body);
    let { username, password } = ctx.request.body;
    if(username && password){
        // 查询数据库有没有这个账户
        let sql = `SELECT * FROM user WHERE username='${username}'`;
        let result = await queryFn(sql); //[]  [{}]
        if(result.length>0 && result[0].password === password){
            //存在用户，把生成的token更新到用户名上
            let token = jwt.sign(
                { username, password },    // 携带信息
                'miyao',          // 秘钥
                { expiresIn: '1h' }        // 有效期：1h一小时
            )
            let sql1 = `UPDATE user SET token='${token}' WHERE username='${username}'`;
            await queryFn(sql1);
            //再次查询用户
            let result1 = await queryFn(sql);
            let obj = {
                username: result1[0].username,
                'cms-token': result1[0].token,
                avatar: result1[0].avatar,
                player: result1[0].player,
                editable: result1[0].editable
            }
            ctx.body = returnMsg(0, "登录成功", obj)
        }else{
            //不存在这个用户
            ctx.body = returnMsg(2, "用户不存在或密码错误", "用户不存在，请先注册")
        }
    }else{
        ctx.body = returnMsg(1, "登录失败", "用户名或密码出错")
    }
})



module.exports = router;