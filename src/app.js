import express from "express";
import routerProducts from "./routes/productsRoute.js";
import cartsRoute from "./routes/cartsRoute.js";

const app = express();
const port = 8080;

app.listen(port, console.log("Sevidor corriendo en el puerto : ",port));



app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products/",routerProducts)
app.use("/api/carts/",cartsRoute)


