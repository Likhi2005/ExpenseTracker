import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';


dotenv.config();

const app=express();
const PORT = process.env.PORT;


app.use(cors({ origin: "*" }));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
    res.status(200).json({
        status:"success",
        message:"Welcome to the API"
    });
});


app.use("/api-v1",routes);


app.use((req,res)=>{
    res.status(404).json({
        status:"not found",
        message:"Route not found"
    });
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});