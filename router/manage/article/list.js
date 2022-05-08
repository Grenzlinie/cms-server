const Router = require("koa-router")
const router = new Router();
const { returnMsg, queryFn } = require('../../../utils')

//文章列表 /article/list
router.post("/", async ctx => {
    let sql = `SELECT COUNT(*) 'ROWS' FROM article`;
    let result = await queryFn(sql);
    let total = result[0].ROWS;
    let {current, counts} = ctx.request.body;
    if(!current || !counts){
        ctx.body=returnMsg(1, "参数错误");
        return;
    }
    //第一页的数据 index:0;第二页的数据 index:10; 第三页的数据： index:20;
    let sql1 = `SELECT id,title,subTitle,date FROM article LIMIT ${(current-1)*counts},${counts}`;
    let arr = await queryFn(sql1);
    ctx.body = returnMsg(0, "分页查询成功", {
        current, counts, total, arr
    });
})

module.exports = router;