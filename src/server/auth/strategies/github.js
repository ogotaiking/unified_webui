import { Strategy as GithubStrategy } from 'passport-github';
import User from '../../models/user';
import { github as GithubConfig } from '../../../../config/auth/config';
import { findOrCreate } from '../';

export default new GithubStrategy(GithubConfig,
    function(token, tokenSecret, profile, done) {
        // retrieve user ...
        console.log(profile);
        process.nextTick(() => {
            //check user table for anyone with a github ID of profile.id
            const newUser = {};
            //TODO this is a hard code for add user...
            newUser.username = "GIT_HUB_NAME__"+profile.username;
            newUser.email = profile.username+"@GIT_HUB_EMAIL.com";
            newUser.phone = "GIT_HUB_PHONE__"+profile.id;
            newUser.github = profile;
            newUser.github.username = profile.username;
            newUser.github.name = profile.displayName;
            newUser.github.token = token;
            findOrCreate({
                'github.id': profile.id
            }, newUser, done);
        });
    })
