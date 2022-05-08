const Router = require("koa-router");
const manage = require("./manage");
const web = require("./web");
const errorPage = require("./errorPage")
const router = new Router();


router.get("/", async ctx=>{
    ctx.body = "根路径"
})
// 404页面路由
router.use("/404", errorPage.routes(), errorPage.allowedMethods());
router.use("/manage", manage.routes(), manage.allowedMethods());
router.use("/web", web.routes(), web.allowedMethods());

module.exports = router;