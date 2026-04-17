import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: `${config.BACKEND_URL}/api/v1/auth/google/callback`,
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      // Just extract profile info and pass it to the controller logic
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0]?.value || "",
      };

      return done(null, user);
    }
  )
);

export default passport;
