const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require('./models/User');

passport.use(new LocalStrategy(User.authenticate()));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '661412c5eabb48b2197d23031af286f276ea93c87cc2b30145c6cd1aa67a6954'
}, (payload, done) => {
    User.findById(payload.sub)
        .then(user => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch(err => done(err, false));
}));

module.exports = passport;
