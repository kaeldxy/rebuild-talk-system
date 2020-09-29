"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("./models/kefuModel");
require("./models/recordModel");
mongoose_1.default.connect('mongodb://localhost/talksystem', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: "talksystem",
    pass: "DXY123456"
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("we're connected!"));
