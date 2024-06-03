/*  For licensing see accompanying LICENSE file.
    Copyright (C) 2024 Apple Inc. All Rights Reserved.
*/

import React, { useState } from "react";
import styles from "../pages/index.module.css";
import { defaultSVGMinis } from '../components/defaultSVGs'

const ButtonGroup = ({ buttons, doSomethingAfterClick }) => {
  const [clickedId, setClickedId] = useState(-1);
  const handleClick = (event, id) => {
    setClickedId(id);
    doSomethingAfterClick(event);
  };

  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={i === clickedId ? styles.active : styles.button}
        >
          <img name={buttonLabel} src={`data:image/svg+xml;utf8,${encodeURIComponent(defaultSVGMinis[buttonLabel])}`} />
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;