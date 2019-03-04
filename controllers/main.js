exports.getMain = (req, res, next) => {
  res.render('main', {
    pageTitle: 'Main Page'
  });
};