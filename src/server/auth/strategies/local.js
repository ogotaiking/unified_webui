import {Strategy as CustomStrategy } from 'passport-custom';
import User from '../../models/user';

export default new CustomStrategy(async (ctx, done) => {
    try {
        if (ctx.body.userid && ctx.body.password && ctx.body.clientfp) {
            let userid = ctx.body.userid.trim().toLowerCase();
            const user = await User.findOne({
                $or: [
                    {'username' : userid },
                    {'email'    : userid },
                    {'phone'    : userid }
                ]
            });

            if (!user) {
                return done(null, false, { 'message': 'User not found.'});
            }

            const password = ctx.body.password;
            if (!user.validPassword(password))
                return done(null, false, { 'message': 'Password not correct.' });

            done(null, user,{'clientfp': ctx.body.clientfp});
        } else {
            done(null, false, { 'message': 'Userid(name/email/phone) and Password and FP are required.' });
        }
    } catch (error) {
        done(error);
    }
});

