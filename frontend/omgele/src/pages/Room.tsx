import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
const URL = "http://localhost:3000";
export const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const name = searchParams.get("name");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lobby, setLobby] = useState(true);
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  
  const [sendingPc, setSendingPc] = useState<RTCPeerConnection | null>(null);
  const [receivingPc, setReceivingPc] =
    useState<RTCSessionDescriptionInit | null>(null);

  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }: { roomId: string }) => {
      setLobby(false);
      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      const sdp = await pc.createAnswer();
      socket.emit("offer", {
        sdp,
        roomId,
      });
      alert("send offer please");
    });
    socket.on(
      "offer",
      async ({ roomId, offer }: { roomId: string; offer: any }) => {
        alert("send answer please");
        setLobby(false);
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription({ sdp: offer, type: "offer" });
        const sdp = await pc.createAnswer();
        setReceivingPc(sdp);
        pc.ontrack = ({ track, type }) => {
          if (type === "audio") {
            setRemoteAudioTrack(track);
          } else {
            setRemoteVideoTrack(track);
          }
        };
        socket.emit("answer", {
          roomId,
          sdp: "",
        });
      }
    );
    socket.on(
      "answer",
      ({ roomId, answer }: { roomId: string; answer: any }) => {
        setLobby(false);
        setSendingPc((pc) => {
          pc?.setRemoteDescription({
            type: "answer",
            sdp: answer,
          });
          return pc;
        });
        alert("answer received");
      }
    );
    socket.on("lobby", () => {
      setLobby(true);
    });
    setSocket(socket);
  }, [name]);
  if (lobby) {
    return <>waiting to connect someone</>;
  }
  return (
    <div>
      Hi {name}
      <video width={400} height={400} />
      <video width={400} height={400} />
    </div>
  );
};
