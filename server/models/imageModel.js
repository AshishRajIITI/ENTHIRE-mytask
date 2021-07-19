const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({

    imageUrl:{
        required: true,
        type: String
    }
});

const image = mongoose.model('imageModel',imageSchema);

module.exports = {
    imageModel: image,
};

