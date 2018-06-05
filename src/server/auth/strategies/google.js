import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from '../../models/user';
import { google as GoogleConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new GoogleStrategy(GoogleConfig,
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a google ID of profile.id
            const newUser = {};
            newUser.google = profile;
            newUser.google.name = profile.displayName;
            newUser.google.token = token;
            newUser.google.email = profile.emails[0].value;
            findOrCreate({
                'google.id': profile.id 
            }, newUser, done);
        });
    })
