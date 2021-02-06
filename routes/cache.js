var express = require('express');
var router = express.Router();

/* GET cache on listing. */
router.get('/on', function(req, res, next) {
  const now = new Date();
  const later = now.setSeconds(now.getSeconds()+30);
  res.set('Epires', new Date(later).toUTCString());
  res.set('Cache-control', 'public, max-age=600');
  res.render('cache/on', {
     title: 'Express-Cache On',
     number: Math.random(10)
  });
});

/* GET max-age 0 listing. */
router.get('/max-age0', function(req, res, next) {
  res.set('Cache-control', 'private, max-age=0');
  res.render('cache/max-age0', {
     title: 'Express Max-age=0',
     number: Math.random(10)
  });
});

/* GET no cache listing. */
router.get('/no-cache', function(req, res, next) {
  res.set('Cache-control', 'no-cache');
  res.render('cache/no-cache', {
     title: 'Express No-Cache',
     number: Math.random(10)
  });
});

/* GET no store listing. */
router.get('/no-store', function(req, res, next) {
  res.set('Cache-control', 'no-store');
  res.render('cache/no-store', {
     title: 'Express No-Store',
     number: Math.random(10)
  });
});

module.exports = router;
