import React from 'react';
import { faHourglassStart, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <header>
      <h1 className='header-title'>
        <FontAwesomeIcon className='header-icon' icon={faLeaf} />
        Pomodoro
      </h1>
      <FontAwesomeIcon className='header-icon' icon={faHourglassStart} />
    </header>
  );
}