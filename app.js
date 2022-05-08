const Koa = require('koa2');
const app = new Koa();
const {host, port} = require("./utils")
const router = require("./router");
const cors = require("koa2-cors");
const path = require('path');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');

//跨域问题解决：场景（localhost:3000页面向localhost:9000
//服务器请求资源就会触发cors policy，通过浏览器devTool可查看）
app.use(cors());

app.use(bodyParser());
app.use(static(path.join(__dirname, '/assets')));
app.use(static(path.join(__dirname, 'router/manage/upload')))
// 匹配不到页面的全部跳转去404
app.use(async (ctx, next) => {
    await next();
    if (parseInt(ctx.status) === 404) {
        ctx.response.redirect("/404")
    }
})
app.use(router.routes(), router.allowedMethods());


app.listen(port, ()=>{
    console.log(`Server is running at ${host}:${port}`);
})


