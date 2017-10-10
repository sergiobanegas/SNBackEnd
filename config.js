module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || "secret-token",
  DB: "mongodb://localhost/social-network",
  TEST_DB:"mongodb://localhost/social-network_test",
  PORT: process.env.PORT || 3000,
  TEST_PORT: 3001
};
