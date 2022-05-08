const Router = require("koa-router")
const router = new Router();
const list = require('./list')
const info = require('./id')
const edit = require('./edit')
const delete1 = require('./delete');
const add = require('./add');



router.use('/list', list.routes(), list.allowedMethods())
router.use('/info', info.routes(), info.allowedMethods())
router.use('/delete', delete1.routes(), delete1.allowedMethods())
router.use('/edit', edit.routes(), edit.allowedMethods())
router.use('/add', add.routes(), add.allowedMethods())

module.exports = router;