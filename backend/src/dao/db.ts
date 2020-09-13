import mongoose from 'mongoose'
import './models/kefuModel'
import './models/recordModel'
mongoose.connect('mongodb://localhost/talksystem', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	user: "talksystem",
	pass: "DXY123456"
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open',  () => console.log("we're connected!"))

