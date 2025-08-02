const mongoose = require('mongoose');


const TaskSchema=new mongoose.Schema({
    title:{ type:String,require:true},
    description:{type:String,require:true},
    created_at:{type:Date , default:Date.now},
    updated_at:{type:Date},
    user_create:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    //Agregamos Tag para poder despues agrupar tareas en base a un Etiqueta
    tag:{                       
        name:{type:String},
        color:{type:String}
    },
    status:{
        type:String,
        enum:['pending','paused','processing','completed']
    },
    //Usado para poder realizar un soft-deleted y recovery de tareas
    deleted:{type:Boolean,default:false}, 
    deteled_at: {type:Date}
})

const Task = mongoose.model('Task',TaskSchema);
module.exports = Task;