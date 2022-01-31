import React from 'react';
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  return (
    <header>
      <h1 className='header-title'>Pomodoro</h1>
      <FontAwesomeIcon className='header-icon' icon={faHourglassStart} />
    </header>
  );
}