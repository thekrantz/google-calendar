const router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next) => {
  try {
    const {code} = req.body
    res.send(code)
  } catch(error){
    next(error)
  }
})

module.exports = router;
