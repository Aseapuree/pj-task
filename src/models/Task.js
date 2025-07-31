const { default: mongoose } = require('mongoose');
const moongose = require('mongoose')


const TaskSchema=new moongose.Schema({
    title:{ type:String,require:true},
    description:{type:String,require:true},
    created_at:{type:Date , default:Date.now},
    updated_at:{type:Date},
    user_create:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    tag:{
        name:{type:String,require:true},
        color:{type:String,require:true}
    },
    status:{
        type:String,
        enum:['pending','paused','processing','completed']
    }
})

const Task = moongose.model('Task',TaskSchema);
module.exports = Task;