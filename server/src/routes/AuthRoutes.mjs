import passport from 'passport';
import express from 'express';

const router = express.Router()

router.post('/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {

    if (err)
      return next(err);

    if (!user) 
      return res.status(401).send(info);
    
    req.login(user, (err) => {
      if (err)
        return next(err);
      
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

router.get('/session/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;