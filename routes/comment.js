const express = require('express');
const commentController = require('../controllers/comment');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/add-comment', isAuth, commentController.getAddComment);
router.post('/add-comment', isAuth, commentController.postAddComment);
router.get('/display-comments', commentController.getComments);
router.get('/edit-comment/:commentId', isAuth, commentController.getEditComment);
router.post('/edit-comment', isAuth, commentController.postEditComment);
router.post('/delete-comment', isAuth, commentController.postDeleteComment);

module.exports = router;