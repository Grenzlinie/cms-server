const Router = require("koa-router")
const router = new Router();
const path = require("path");
const jwt = require('jsonwebtoken')
const { returnMsg, queryFn, jwtVerify } = require('../../utils')
const multer = require("@koa/multer")

//储存文件的名称
let myFileName = "";

var storage = multer.diskStorage({
    //文件保存路径
    destination: path.join(__dirname, 'upload/'),
    //修改文件名称
    filename: (req, file, cb) => {
        myFileName = `${file.fieldname}-${Date.now().toString(16)}.${file.originalname.split('.').splice(-1)}`
        cb(null, myFileName)
    }
})


//文件上传限制
const limits = {
    fields: 1,//非文件字段的数量
    fileSize: 200 * 1024,//文件大小 单位 b
    files: 1//文件数量
}

let upload = multer({ storage, limits })

router.post('/', upload.single('avatar'), async ctx => {
    //鉴权
    let token = ctx.request.headers['cms-token'];
    //鉴权
    if (!jwtVerify(token)) {
        ctx.body = returnMsg(2, '查询用户信息失败', 'token过期或用户未注册')
        return;
    }
    //鉴权成功修改数据对应的avatar字段
    let sql = `UPDATE user SET avatar='${myFileName}' WHERE token='${token}'`;
    await queryFn(sql);
    //重新查找这条数据并且返回给前端
    let sql2 = `SELECT username,avatar,token FROM user WHERE token='${token}'`
    let result = await queryFn(sql2);
    ctx.body = returnMsg(0, "修改成功", {
        avatar: result[0].avatar,
        username: result[0].username,
        'cms-token': result[0].token
    });
})

module.exports = router;