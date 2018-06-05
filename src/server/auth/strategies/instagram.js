import { Strategy as InstagramStrategy } from 'passport-instagram';
import User from '../../models/user';
import { instagram as InstagramConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new InstagramStrategy(InstagramConfig,
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a instagram ID of profile.id
            const newUser = {};
            newUser.instagram = profile;
            newUser.instagram.name = profile.displayName;
            newUser.instagram.token = token;
            findOrCreate({
                'instagram.id': profile.id
            }, newUser, done);
        });
    })
