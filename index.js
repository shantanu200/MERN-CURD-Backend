import express from "express";
import cors from "cors";
import mongoose from "mongoose";


const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());



const url = "mongodb://localhost:27017/curddb";

mongoose.connect(url,{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database Connected");
})

const userSchema = mongoose.Schema({
    name : String,
    email : String
});

const User = new mongoose.model("User",userSchema);

const PORT = process.env.PORT || 5000;

app.get("/fetch",(req,res) => {
    User.find({},(err,docs) => {
        if(err){
            res.send(err);
        }else{
            res.send(docs);
        }
    });
});

app.post("/add",(req,res) => {
    if(!req.body) res.sendStatus(400);
    
    const {name,email} = req.body;

    if(name != null && email != null){
        const user = new User({
            name,
            email
        });
        user.save().then((user)=>{
            res.send({
                message: "New Data is added with name and email"
            });
        })
        .catch((err) => {
            res.send({
                message : "Error"
            });
        });
    }
});

app.get("/:id",(req,res) => {
    let id = req.params.id;
    User.findById(id,(err,user) => {
        res.json(user);
    })
})

app.post("/update/:id",(function(req,res){
    User.findById(req.params.id,function(err,user){
        if(!user) res.status(404).send("Data is not found");

        else{
            user.name = req.body.name;
            user.email = req.body.email;

            user.save().then(user=>{
                res.json("User is Updated");
            })
            .catch((err) => {
                res.status(400).send("Update not Possible");
            })
        }
    })
}))

app.get("/delete/:id",function(req,res) {
    User.findByIdAndRemove({
        _id:req.params.id
    },function(err,user){
        if(err) res.json(err);
        else res.json("User deleted Sucessfully");
    });
});

app.listen(PORT,() => {
    console.log(`server link is http://localhost:${PORT}`);
})