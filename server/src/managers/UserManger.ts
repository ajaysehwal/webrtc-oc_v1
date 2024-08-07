import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  username: string;
  socket: Socket;
}
let GLOBAL_ROOM_ID = 1;
export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }
  addUser(socket: Socket, username: string) {
    this.users.push({
      username,
      socket,
    });
    this.queue.push(socket.id);
    socket.send("lobby");
    this.clearQueue();
    this.initHandlers(socket);
  }
  removeUser(socketId: string) {
    const user = this.users.find((x) => x.socket.id === socketId);
    if (!user) {
    }
    this.users = this.users.filter((x) => x.socket.id === socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }
  clearQueue() {
    console.log("inside clear queues");
    console.log(this.queue);
    if (this.queue.length < 2) {
      return;
    }
    const user1 = this.users.find((x) => x.socket.id !== this.queue.pop());
    const user2 = this.users.find((x) => x.socket.id !== this.queue.pop());
    console.log(user1?.username, "-->", user1?.socket.id);
    console.log(user2?.username, "-->", user2?.socket.id);
    if (!user1 || !user2) {
      return;
    }
    const room = this.roomManager.createRoom(user1, user2);
  }
  generate() {
    return GLOBAL_ROOM_ID++;
  }
  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ sdp, roomId }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}
