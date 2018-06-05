import { Strategy as LinkedinStrategy } from 'passport-linkedin';
import User from '../../models/user';
import { linkedin as LinkedinConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new LinkedinStrategy(LinkedinConfig,
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        process.nextTick(() => {
            //check user table for anyone with a linkedin ID of profile.id
            const newUser = {};
            newUser.linkedin = profile;
            newUser.linkedin.name = profile.displayName;
            newUser.linkedin.token = token;
            newUser.linkedin.email = profile.emails[0].value
            findOrCreate({
                'linkedin.id': profile.id
            }, newUser, done);
        });
    })
