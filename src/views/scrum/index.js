import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { points } from "../../utils/constants";
import style from "./style.module.scss";
import loadingGif from "../../assets/images/loading-nesine-icon.gif";
import nesineIcon from "../../assets/images/nesine-icon.png";

const Scrum = () => {
  //const port = process.env.PORT || 3001;
  const socket = io();
  const params = useParams();
  const roomId = params.id;

  const [cookies, setCookie] = useCookies();
  const [users, setUsers] = useState([]);
  const [exist, setExits] = useState(false);
  const [username, setUsername] = useState("");
  const [estimate, setEstimate] = useState("-");
  const [show, setShow] = useState(false);
  const [result, setResult] = useState("");

  const isAdmin = cookies[roomId] === "admin";

  useEffect(() => {
    if (cookies[roomId] !== undefined) {
      setUsername(cookies[roomId]);
      socket.emit("get-users", roomId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enterRoom = () => {
    socket.emit("check-username", { username, roomId });
  };

  const clickCard = (number) => {
    setEstimate(number);
    socket.emit("estimate-update", { username, number, roomId });
  };

  const deleteEstimates = () => {
    setShow(false);
    socket.emit("delete-estimates", { roomId });
  };

  const getResult = (data) => {
    data.sort((x, y) => y.estimate - x.estimate);
    const calcResult = data.reduce(
      (acc, curr) => {
        const filtered = data.filter((item) => item.estimate === curr.estimate);
        if (filtered.length > acc?.count) {
          return { ...curr, count: filtered.length };
        } else {
          return acc;
        }
      },
      { count: 0 }
    );
    setResult(calcResult.estimate);
  };

  const changeInput = (e) => {
    setExits(false);
    setUsername(e.target.value);
  };

  const showEstimates = () => {
    socket.emit("show-estimates-emit", { roomId });
  };

  socket.on("users-list", (data) => {
    if (data) {
      setUsers([...data]);
    }
  });

  socket.on("estimate-updated", (data) => {
    setUsers([...data]);
    getResult(data);
  });

  socket.on("reset-estimates", (data) => {
    setEstimate("-");
    setShow(false);
    setUsers([...data]);
  });

  socket.on("already-exist", () => {
    console.log("Exist");
    setExits(true);
  });

  socket.on("user-login", (data) => {
    if (!isAdmin) {
      setCookie(roomId, username);
    }
    setUsers([...data]);
  });

  socket.on("show-estimates-on", () => {
    setShow(true);
  });

  if (cookies[roomId] === undefined) {
    return (
      <div className={style.login}>
        <h2>Let's start!</h2>
        <p>Join the room:</p>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => changeInput(e)}
        />
        {exist && <small>Name already exist!</small>}
        <button type="button" onClick={enterRoom}>
          ENTER
        </button>
      </div>
    );
  }

  if (users.length < 1) {
    return (
      <div className="container">
        <div className={style.waiting}>
          Waiting users...
          <img src={loadingGif} alt="" />
        </div>
      </div>
    );
  }

  return (
    <div className={style.room}>
      <div className="container">
        {!isAdmin && (
          <div className={style.estimates}>
            {points.map((item, index) => (
              <div
                className={`${style.card} ${
                  estimate === item ? style.selected : ""
                }`}
                onClick={() => clickCard(item)}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        )}
        <div className={style.row}>
          <div className={style.list}>
            {isAdmin && (
              <div className={style.options}>
                <button onClick={deleteEstimates}>
                  Delete Estimates
                </button>
                <button onClick={showEstimates}>
                  Show
                </button>
              </div>
            )}
            <div className={style.table}>
              <div className={style.header}>
                <span className={style.name}>Name</span>
                <span className={style.storyPoint}>Story Points</span>
              </div>
              <div className={style.content}>
                {users.map((user, index) => (
                  <div className={style.item} key={index}>
                    <span className={style.name}>{user.name}</span>
                    <span className={style.storyPoint}>
                      {!show && user.estimate !== "-" ? (
                        <img src={nesineIcon} alt="" />
                      ) : (
                        <span className={style.box}>{user.estimate}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={style.result}>
            {/* <div className={style.title}>Result</div> */}
            <div className={style.point}>{show ? result : "-"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scrum;
