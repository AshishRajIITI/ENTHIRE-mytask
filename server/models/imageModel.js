const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({

    imageUrl:{
        type: String,
        unique: true,
    }
});

const ImageModel = mongoose.model('ImageModel', imageSchema);

module.exports = ImageModel;
