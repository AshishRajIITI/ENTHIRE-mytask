const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();

const ImageModel = require('./models/imageModel');

app.use(cors({
	origin: "http://localhost:3000",
	credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGO_DB_ATLAS_URL;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});


router.route("/").post((req, res) => {
	const imageUrl = req.body.canvasUrl;

	ImageModel.findOne({ imageUrl: imageUrl })
		.then((mssg) => {
			if (mssg) {
				res.send("already in database");
			}
			else{

			const newImageUrl = new ImageModel({
				imageUrl: imageUrl,
			});

			newImageUrl.save()
				.then(() => res.json("kscvDJYBKUczxnbgvjlsdkb"))
		}
		})
		.catch((err) => res.json(err));

});

app.use("/create", router);

app.listen(8000, () => {
	console.log(`Server is running at port no. : 8000`);
});