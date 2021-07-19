const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();



app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let imageUrl ;

router.route("/").post((req, res)=>{    
    imageUrl = req.body;
    console.log(imageUrl);
    res.send(imageUrl);    
});

app.use("/",router);

const uri = process.env.MONGO_DB_ATLAS_URL;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const connection = mongoose.connection;

console.log("hvgkfjdsblcn");

connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

app.listen(8000, () => {
	console.log(`Server is running at port no. : 8000`);
});