const Router = require("koa-router")
const router = new Router();
const { returnMsg, queryFn, jwtVerify } = require('../../utils')

//获取小编列表
router.get('/', async ctx => {
    //鉴权
    let token = ctx.request.headers['cms-token'];
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    //读取数据库中所有用户
    let sql = `SELECT avatar,editable,id,username FROM user WHERE player!='vip'`;
    let result = await queryFn(sql);
    ctx.body = returnMsg(0, '列表请求成功', result)
})

//修改编辑权限
router.post('/', async ctx => {
    //鉴权
    let token = ctx.request.headers['cms-token'];
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    //根据前端传过来的id，修改用户的编辑权限
    /*
    开通编辑权限，open传1，关闭传2
    */
    let { id, open } = ctx.request.body;
    if (!id || !open) {
        ctx.body = returnMsg(1, "参数错误");
        return;
    }
    //有id传过来
    let sql1 = `SELECT editable FROM user WHERE id=${id}`;
    let result1 = await queryFn(sql1);
    //如果这个用户已经有编辑权限
    if (result1[0].editable === 1 && open === 1) {
        //同时前端还想开通编辑权限
        ctx.body = returnMsg(2, "该用户已有编辑权限");
        return;
    }
    //如果这个用户本来没有编辑权限
    if (result1[0].editable === 0 && open === 2) {
        //同时前端还想开通编辑权限
        ctx.body = returnMsg(2, "该用户本来就没有编辑权限");
        return;
    }
    //剩下所有修改用户编辑权限
    let sql2 = `UPDATE user SET editable='${open===1?1:0}' WHERE id=${id}`;
    await queryFn(sql2);
    ctx.body = returnMsg(0, "用户编辑权限修改成功");
})

module.exports = router;