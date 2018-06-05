import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../../models/user';
import { facebook as FacebookConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new FacebookStrategy(FacebookConfig,
    async(token, tokenSecret, profile, done)=> {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a facebook ID of profile.id
            const newUser = {};
            newUser.facebook = profile._json;
            newUser.facebook.token = token;
            findOrCreate({
                'facebook.id': profile.id
            }, newUser, done);
        });
    })
