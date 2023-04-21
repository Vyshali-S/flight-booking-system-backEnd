const express = require("express");
const mongoose = require("mongoose")
const cors = require('cors')
const app = express();
app.use(cors())

const userRoute = require("./routes/users") 
const flightsRoutes = require("./routes/flights")
const adminRoutes =require("./routes/admin")
const authUser = require("./routes/authUser")
const authAdmin = require("./routes/authAdmin")


mongoose.connect("mongodb://0.0.0.0:27017/FlightBookingSystem")
.then(()=>{console.log("connection sucess")})
.catch(err=> console.log(err))

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Hey Working file")
})

app.use("/users",userRoute) 
app.use("/flights",flightsRoutes)
app.use("/admins",adminRoutes)
app.use("/authUser",authUser)
app.use("/authAdmin",authAdmin)


const port = process.env.PORT || 3000;
app.listen(port,()=> console.log(`application running On port - ${port} 👌`) )