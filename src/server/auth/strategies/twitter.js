import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../../models/user';
import { twitter as TwitterConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new TwitterStrategy(TwitterConfig,
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a twitter ID of profile.id
            const newUser = {};
            newUser.twitter = profile;
            newUser.twitter.token = token;
            findOrCreate({
                'twitter.id': profile.id
            }, newUser, done);
        });
    })
