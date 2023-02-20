import React from "react";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import style from "./style.module.scss";

const Header = () => {
  const params = useParams();
  const roomId = params.id;

  console.log(roomId);

  const copyClipboard = () => {
    // Copy the text inside the text field
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className={style.header}>
      <div className="container">
        <div className={style.flex}>
          <a href="/">Scrum Poker</a>
          {roomId && (
            <div className={style.share}>
              <div className={style.link}>
                <span id="link">{window.location.href}</span>
                <button type="button" onClick={copyClipboard}>
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
