const express = require("express");
const mongoose = require("mongoose")
const app = express();
const userRoute = require("./routes/users") 
const flightsRoutes = require("./routes/flights")

mongoose.connect("mongodb://0.0.0.0:27017/FlightBookingSystem")
.then(()=>{console.log("connection sucess")})
.catch(err=> console.log(err))

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hey Working file")
})
app.use("/users",userRoute) 
app.use("/flights",flightsRoutes)

const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`application running On port - ${port} 👌`) )