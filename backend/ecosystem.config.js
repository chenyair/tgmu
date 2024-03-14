module.exports = {
  apps : [{
    name   : "TGMU backend",
    script : "./dist/index.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}
