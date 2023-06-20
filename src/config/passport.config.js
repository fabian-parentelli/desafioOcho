import passport from 'passport';
// import GitHubStragey from 'passport-github2';
// import { userModel } from '../dao/models/user.model.js';
import jwt from 'passport-jwt';
import { PRIVATE_KEY, CLIENTEID, CLIENTESECRET, CALLBACKURL  } from './contants.config.js';

const JWTStrategy = jwt.Strategy;
const EXTRACTJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: EXTRACTJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
                return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        };
    }));

    // passport.use('github', new GitHubStragey({
    //     clientID: CLIENTEID,
    //     clientSecret: CLIENTESECRET,
    //     callbackURL: CALLBACKURL,
    //     scope: ['user:email']
    // }, async (accessToken, refreshToken, profile, done) => {
    //     try {
    //         const email = profile.emails[0].value;
    //         const user = await userModel.findOne({ email });
    //         if (!user) {
    //             const newUser = {
    //                 first_name: profile._json.name,
    //                 last_name: ' ',
    //                 age: 18,
    //                 email,
    //                 password: ' '
    //             };
    //             const result = await userModel.create(newUser);
    //             done(null, result);
    //         } else {
    //             done(null, user)
    //         };

    //     } catch (error) {
    //         return done(error);
    //     };
    // }));

    // passport.serializeUser((user, done) => { done(null, user._id) });
    // passport.deserializeUser(async (id, done) => {
    //     const user = await userModel.findById(id);
    //     done(null, user);
    // });
};

export default initializePassport;