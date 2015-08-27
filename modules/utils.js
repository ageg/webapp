verify_params = function(params) {
  return function (req, res, next) {
    obj = req.body;
    isCorrect = true;
    params.forEach(function (param) {
      if (!(param in obj) && isCorrect) {
        res.status(400);
        res.json({ error: param + ' parameter is mandatory' });
        isCorrect = false;
      }
    });

    if (isCorrect) {
      next();
    }
  }
};

verify_queryparams = function (params) {
  return function (req, res, next) {
    obj = req.query;
    isCorrect = true;
    params.forEach(function (param) {
      if (!(param in obj) && isCorrect) {
        res.status(400);
        res.json({ error: param + ' parameter is mandatory' });
        isCorrect = false;
      }
    });
    
    if (isCorrect) {
      next();
    }
  }
};

module.exports = {
  verify_params: verify_params,
  verify_queryparams: verify_queryparams
};