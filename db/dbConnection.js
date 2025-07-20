const mongoose = require("mongoose");
module.exports = mongoose.connect("mongodb://localhost:27017/linkedin", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});
