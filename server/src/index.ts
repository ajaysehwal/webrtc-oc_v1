import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import { UserManager } from "./managers/UserManger";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server,{cors:{
    origin:'*'
  }});
  const userManager= new UserManager()
  io.on("connection", (socket: Socket) => {
    console.log("connected ---- user * ",socket.id);
    userManager.addUser(socket,"randomUser")
    socket.on("disconnect", () => {
      userManager.removeUser(socket.id);
    });
  });
  server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

startServer().catch((error)=>{
    console.log("Error: " + error)
})