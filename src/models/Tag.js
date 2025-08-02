const moongose = require('mongoose')


const TagSchema = new moongose.Schema({
    name: {type:String,require:true},
    color: {type:String},
    created_at:{type:Date, default:Date.now()},
    updated_at:{type:Date},
    user_create:{type:moongose.Schema.Types.ObjectId,ref:'User'},
    deleted:{type:Boolean,default:false},
    deleted_at:{type:Date}
})

const Tag = moongose.model('Tag',TagSchema);
module.exports=Tag;