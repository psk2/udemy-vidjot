if (process.env.NODE_ENV === "production") {
    module.exports = { mongoURI: "mongodb://<psk>:<root>@ds231588.mlab.com:31588/vidjot-prod" }
} else {
    module.exports = { mongoURI: "mongodb://localhost/vidjot-dev" }
}