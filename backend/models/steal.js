const mongoose =require('mongoose')

const StealVideoSchema = new mongoose.Schema
({
    wallet:{
        type:String,
        required:true,
    },
    signature:{
        type:String,
        required:true,
    },
});
  
module.exports = mongoose.model("Steal",StealVideoSchema);

