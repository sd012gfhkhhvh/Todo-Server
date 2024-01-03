const zod = require('zod');

//todos schema
const createTodo = zod.object({
    title: zod.string().min(1),
    description: zod.string().min(1)
})

//update schema
const updateTodo = zod.object({
    id: zod.string()
})

const editTodo = zod.object({
    id: zod.string(),
    title: zod.string(),
    description: zod.string()
})

module.exports = {
    createTodo: createTodo,
    updateTodo: updateTodo,
    editTodo: editTodo
}