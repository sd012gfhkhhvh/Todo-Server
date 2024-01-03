const express = require('express');
const app = express();
const { createTodo, updateTodo, editTodo } = require('./types')
const { todo } = require("./db");
const cors = require('cors');
const port = process.env.PORT || 6010;

app.use(express.json())
app.use(cors())

function isCreateTodo(req, res, next) {
    const createPayload = req.body
    const parsedPayload = createTodo.safeParse(createPayload)
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Invalid format"
        })
    }
    next();
}

function isUpdateTodo(req, res, next) {
    console.log("Update route hits");
    const updatePayload = req.body
    const parsedPayload = updateTodo.safeParse(updatePayload)
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Invalid format"
        })
    }
    next();
}

function idEditTodo(req, res, next) {
    const editPayload = req.body
    const parsedPayload = editTodo.safeParse(editPayload)
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "Invalid format"
        })
    }
    next();
}

app.post('/todo', isCreateTodo, async (req, res) => {
    const title = req.body.title
    const description = req.body.description
    try {
        //put in mongodb
        await todo.create({
            title: title,
            description: description,
            marked: false
        })
        console.log("Todo created");
        res.status(200).json({
            msg: "Todo created successfully"
        })
    }
    catch (error) {
        console.error(error);
        res.status(404).json({
            msg: "Failed to create"
        })
    }
})

app.get("/todos", async (req, res) => {
    try{
        const todos = await todo.find({})
        res.status(200).json(todos);
    }
    catch (error) {
        console.error(error)
    }
})

app.put('/completed', isUpdateTodo, async (req, res) => {
    const id = req.body.id
    try
    {
        let item = await todo.findById(id)
        let isMarked = item.marked
        // console.log(isMarked);
        await todo.updateOne(
            {_id: id},
            {marked: !isMarked} //toggles marked
        )
        console.log("marked successfully");
        res.status(200).json({
            msg: "marked successfully"
        })
    }catch (error) {
        console.error(error);
        res.status(404).json({
            msg: "error updating"
        })
    }
})

app.put("/edit", idEditTodo, async (req, res) => {
    const {id, title, description} = req.body
    try{
        await todo.findByIdAndUpdate(id, {
            title: title,
            description: description
        })
        console.log("updated successfully");
        res.status(200).json({
            msg: "updated successfully"
        })
    }   
    catch (error) {
        console.log("error updating" + error.message);
        res.status(404).json({
            msg: "error updating"
        })
    }
})

app.delete("/completed", isUpdateTodo, async (req, res) => {
    const id = req.body.id
    try{
        await todo.findByIdAndDelete(id)
        console.log("Todo deleted successfully");
        res.status(200).json({
            msg: "Todo deleted successfully"
        })
    }
    catch (error) {
        console.log(error.type);
        res.status(404).json({
            msg: "Error deleting the todo"
        })
    }
})

app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({
        msg:"Server error: " + err.message
    })
})

app.listen(port, () => {
    console.log(`listening on ${port}`);
})