import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [joined,setJoined]=useState('false');
  const videoRef=useRef<HTMLVideoElement>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  useEffect(()=>{
    if(videoRef && videoRef.current){
      getCam()
    }
  },[videoRef])
  const getCam=async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    const audioTrack=stream.getAudioTracks()[0];
    const videoTrack=stream.getAudioTracks()[0];
    setLocalAudioTrack(audioTrack);
    setLocalVideoTrack(audioTrack)
    if(!videoRef.current){
      return;
    }
    videoRef.current.srcObject=new MediaStream(videoTrack);
  }
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Link to={`/room?name=${name}`}>Join</Link>
    </div>
  );
}
