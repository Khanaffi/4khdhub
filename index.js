import  Express  from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import Cors from "cors";
import dotenv from "dotenv"
import fetch from 'node-fetch';
import cron from 'node-cron';
const __dirname = path.resolve();
let mydata;
let tags;

const app=Express();
dotenv.config();
app.use(Cors());
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(Express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
const port=process.env.PORT||5000;

  mongoose.connect(process.env.URL, { useNewUrlParser: true }).then(()=>{
    app.listen(port,()=>console.log("server is started sucessfully"));
  }).catch((err)=>console.log(err));

  const Moviesdetails=new mongoose.Schema({
    imagelogo:String,
    moviename:String,
    discription:String,
    tags:String,
    createdAt:{
      type:Date,
      default: new Date()
    },
    sam1:String,
    sam2:String,
    sam3:String,
    sam4:String,
Download:String

  });
  const movie = mongoose.model("movie",Moviesdetails);
  app.get("/",(req,res)=>{res.status(200)._write("server home page")});

app.get("/done",async (req,res)=>{
  try {
    const moviedata= await movie.find({}).sort({'moviename':-1});
            console.log("done");
    res.status(200).json(moviedata);
   
} catch (error) {
    res.status(404).json({ message: error.message });
}});
async function keepAlive() {
  try {
    const response = await fetch('https://4khdhub.online/');
    if (response.ok) {
      console.log('Server is alive:', new Date());
    } else {
      console.log('Server returned an error:', response.status, new Date());
    }
  } catch (error) {
    console.error('Error making request:', error, new Date());
  }
}

// Schedule the keep-alive function to run every 14 minutes
cron.schedule('*/14 * * * *', () => {
  console.log('Running keepAlive task:', new Date());
  keepAlive();
});
keepAlive();

app.get("/compose",(req,res)=>{res.sendFile('public/compose.html' , { root : __dirname})});
app.get("/sucess",(req,res)=>{
  res.send("sucessfullyt saved");
});
app.get("/search",(req,res)=>{
 movie.findOne({moviename:mydata},(err,post)=>{
    if(!err){
  // console.log(post)
  res.status(200).json(post);
}else{
    console.log(err);
  }
  });
});
app.get("/category", (req,res)=>{
 movie.find({tags:tags},null,{sort: {"moviename": -1}},(err,docs)=>{
  if(!err){
    res.status(200).json(docs);
  }else{
    res.status(404).json(err)
  }
});
});
 
app.post("/search",(req,res)=>{
  const  da =req.body.da;
  // console.log(typeof(da));
mydata=da;
res.status(209).json(da)
  // console.log(pra);


});


app.post("/category",(req,res)=>{
  const { category }=req.body;
  console.log(category);
  tags=category;
  res.status(209).json(category)
})


app.post("/compose",(req,res)=>{
    const movies = new movie({
     imagelogo:req.body.imagelogo,
     moviename:req.body.moviename,
        discription: req.body.discription,
         tags: req.body.tags,
         sam1:req.body.sam1,
         sam2:req.body.sam2,
         sam3:req.body.sam3,
         sam4:req.body.sam4,
Download:req.body.Download
    });
    movies.save((err)=>{
        if(!err){
            res.redirect("/sucess")
            console.log("saved sucessfully");
        }
    });


});

