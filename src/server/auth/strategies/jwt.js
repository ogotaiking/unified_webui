import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User                                    from '../../models/user';
import { JWTSignKey }                          from '../../../../config/auth/config';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey:    JWTSignKey.secret
};

export default new JWTStrategy(opts, async (jwt_payload, done) => {
  //console.log(jwt_payload);
  const user = await User.findById(jwt_payload.id);

  if (user) { done(null, user); }
  if (!user) { done(null, false); }
});
