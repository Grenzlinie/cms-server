const Router = require("koa-router");
const router = new Router();
const { returnMsg, queryFn } = require("../../utils")

router.post('/', async (ctx) => {
    console.log(ctx.request.body);
    let { username, password } = ctx.request.body;
    //判断username和password是否都存在
    if (username && password) {
        //继续往下,查询数据库是否有该用户
        let sql = `SELECT * FROM user WHERE username="${username}"`;
        let result = await queryFn(sql);
        if(result.length>0){
            //有这个用户，返回前端，请勿重复注册
            ctx.body = returnMsg(2, "注册失败", result);
        }else{
            //没有这个用户，开始注册
            /*
                player normal表示普通用户，vip表示管理员
                editable 0 表示不可以编辑， 1表示可以编辑
             */
            let sql1 = `INSERT INTO user VALUES (null, '${username}', '${password}', null, 'avatar.jpg', 'normal', 0)`;
            await queryFn(sql1);
            ctx.body = returnMsg(0, "注册成功");
        }

    } else {
        ctx.body = returnMsg(1, "请求失败", "参数错误");
    }

})



module.exports = router;