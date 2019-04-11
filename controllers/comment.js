const Comment = require('../models/comment');

const getCurrentDate = () => {
  return new Date();
};

const handleError = (err) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
};

const ITEMS_PER_PAGE = 5;
const paginator = (page, ITEMS_PER_PAGE, totalItems) => {
  return {
    hasItems: totalItems > 0,
    currentPage: page,
    hasNextPage: ITEMS_PER_PAGE * page < totalItems,
    hasPreviousPage: page > 1,
    nextPage: page + 1,
    previousPage: page - 1,
    lastPage: totalItems > 0 ? Math.ceil(totalItems / ITEMS_PER_PAGE) : 1
  };
};


exports.getAddComment = (req, res, next) => {
  res.render('comment/add-comment', {
    pageTitle: 'Add Comment'
  });
};

exports.postAddComment = (req, res, next) => {
  const today = getCurrentDate();
  const content = req.body.content;
  const comment = new Comment({
    date: today,
    content,
    userId: req.user._id
  });
  comment
    .save()
    .then(result => {
      console.log(today, `Comment created. Date: ${today}. Content: ${content}`);
      res.redirect('/display-comments');
    })
    .catch(err => handleError(err));
};

exports.getComments = (req, res, next) => {
  const currentUser = req.user;
  const page = parseInt(req.query.page) || 1;
  let totalItems;
  let itemCounterStartInCurrentPage;
  Comment   
    .estimatedDocumentCount()
    .then(number => {
      totalItems = number;
      itemCounterStartInCurrentPage = totalItems - ITEMS_PER_PAGE*(page-1);
      return Comment
        .find()
        .sort({ date: -1 })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
        .populate('userId');
    })
    .then(comments => {
      res.render('comment/comments', {
        itemCounterStartInCurrentPage,
        comments,
        pageTitle: 'Comments',
        currentUser,
        paginationObject: paginator(page, ITEMS_PER_PAGE, totalItems) 
      });
    }).catch(err => handleError(err));
};

exports.getEditComment = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const commentId = req.params.commentId;
  Comment.findById(commentId)
    .then(comment => {
      if (!comment) {
        return res.redirect('/');
      }
      res.render('comment/edit-comment', {
        pageTitle: 'Edit Comment',
        editing: editMode,
        comment
      });
    })
    .catch(err => handleError(err));
};

exports.postEditComment = (req, res, next) => {
  const today = getCurrentDate();
  const commentId = req.body.commentId;
  const updatedContent = req.body.content;
  Comment.findById(commentId)
    .then(comment => {
      if (comment.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      comment.content = updatedContent;
      comment.editDate = today;
      return comment.save()
        .then(result => {
          console.log(today, `Comment edited. Edit Date: ${today}. Content: ${updatedContent}`);
          res.redirect('/display-comments');
        })
        .catch(err => handleError(err));
    })
    .catch(err => handleError(err));
};


exports.postDeleteComment = (req, res, next) => {
  const commentId = req.body.commentId;
  Comment.deleteOne({
      _id: commentId,
      userId: req.user._id
    })
    .then(() => {
      console.log(`Comment with id ${commentId} has been deleted.`);
      res.redirect('/display-comments');      
    })
    .catch(err => handleError(err));
};