const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config();

const url = process.env.DB_URL
const dbName = "todo-db"
const collectionName = "todos"

//database connection
mongoose.connect(url + dbName).then(()=> {
    console.log("Database connection established.");
})

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    marked: Boolean
})

const todo = mongoose.model(collectionName, todoSchema)

module.exports = {
    todo,
}