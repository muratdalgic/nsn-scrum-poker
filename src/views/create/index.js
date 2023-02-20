import React from "react";
import io from "socket.io-client";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import style from "./style.module.scss";

const CreateRoom = () => {
  //const port = process.env.PORT || 3001;
  const socket = io();
  const [, setCookie] = useCookies();
  const navigate = useNavigate();

  const create = () => {
    const roomId = Math.floor(Math.random() * 100000000);
    setCookie(roomId, 'admin');
    socket.emit("create", roomId);
    navigate(`/room/${roomId}`);
  }

  return (
    <div className={style.createPage}>
      <h2>Let's start!</h2>
      <p>Create the room:</p>
      <button type="button" onClick={create}>CREATE</button>
    </div>
  );
};

export default CreateRoom;
