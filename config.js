const PUBLIC_PATH = "/public";
const DEFAULT_PATH = PUBLIC_PATH+"/files/default";
const UPLOADS_PATH = PUBLIC_PATH + "/files/uploads";
const AVATARS_PATH = UPLOADS_PATH + "/avatars";
const DEFAULT_AVATAR_IMAGE = "/files/default/users/default_avatar.png";

module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret-token",
  DB: "mongodb://localhost/social-network",
  TEST_DB:"mongodb://localhost/social-network_test",
  PORT: process.env.PORT || 8000,
  PUBLIC_PATH: PUBLIC_PATH,
  DEFAULT_PATH: DEFAULT_PATH,
  UPLOADS_PATH: UPLOADS_PATH,
  AVATARS_PATH: AVATARS_PATH,
  DEFAULT_AVATAR_IMAGE: DEFAULT_AVATAR_IMAGE
};
