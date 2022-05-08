const Router = require("koa-router")
const router = new Router();

router.get('/', async ctx=>{
    ctx.body = "官网"
})

module.exports = router;