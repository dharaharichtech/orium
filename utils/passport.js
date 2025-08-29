const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../model/userSchema");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = await User.create({
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value,
              provider: "google",
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
              isActive: true,
            });
          }
          return done(null, user);
        } catch (error) {
          console.log("Error in google strategy-passport", error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};



///// facebook

 passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/api/auth/facebook/callback`,
        profileFields: ["id", "emails", "name", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

          let user = await User.findOne({ email });

          if (!user) {
            user = await User.create({
              firstname: profile.name?.givenName || "",
              lastname: profile.name?.familyName || "",
              email,
              provider: "facebook",
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
              isActive: true,
            });
          }
          return done(null, user);
        } catch (error) {
          console.log("Error in facebook strategy-passport", error);
          return done(error, null);
        }
      }
    )
  );

  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
