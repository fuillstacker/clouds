const Router = require('express')
const router = new Router()
const middlw = require('../middleware/auth.middleware')
const fileController = require('../controllers/fileController')

router.post('', middlw, fileController.createDir)
router.post('/upload', middlw, fileController.uploadFile)
router.post('/avatar', middlw, fileController.uploadAvatar)
router.delete('/avatar', middlw, fileController.deleteAvatar)
router.get('', middlw, fileController.getFiles)
router.get('/download', middlw, fileController.downloadFile)
router.delete('/', middlw, fileController.deleteFile)
router.get('/search', middlw, fileController.search)

module.exports = router 