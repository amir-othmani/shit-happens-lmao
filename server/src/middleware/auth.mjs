import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';
import { getUser } from '../dao/UserDao.mjs';


export const initAuth = (app) => {
    // session middleware
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());

    // passport middleware
    passport.use(new LocalStrategy({ usernameField: 'username' }, async function verify(username, password, cb) {
        const user = await getUser(username, password);
        if(!user)
            return cb(null, false, 'Incorrect username or password.');
            
        return cb(null, user);
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (user, cb) { 
        return cb(null, user);
    });
}

// Middleware to check if user is authenticated
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
};