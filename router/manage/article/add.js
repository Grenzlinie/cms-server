const Router = require("koa-router")
const router = new Router();
const { returnMsg, queryFn, jwtVerify } = require('../../../utils')
const moment = require('moment')

router.post("/", async ctx => {
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    let sql2 = `SELECT editable,username FROM user WHERE token='${token}'`;
    let result2 = await queryFn(sql2);

    if (result2[0].editable === 1) {
        let { title, subTitle, content } = ctx.request.body;
        //查询数据库是否有这篇文章
        if (!title || !content) {
            ctx.body = returnMsg(1, "参数错误");
            return;
        }
        let mydate = moment().format('YYYY-MM-DD hh:mm:ss');
        //添加一篇文章
        let sql1 = `INSERT INTO article VALUES (null, '${title}', '${subTitle || ""}', '${result2[0].username}', '${mydate}', '${content}')`;
        await queryFn(sql1);
        ctx.body = returnMsg(0, '文章添加成功')
    } else {
        ctx.body = returnMsg(1, '该用户没有编辑权限')
        return;
    }
})

module.exports = router;