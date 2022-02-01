import React, { useState, useEffect } from 'react';
import { faHourglassStart, faLeaf, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  const [timeSet, setTimeSet] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [displaySetting, setDisplaySetting] = useState(false);
  const [resetSetting, setResetSetting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('time')) updateToLocalStorage();
    else updateFromLocalStorage();

    if (resetSetting) {
      console.log('first');
      updateToLocalStorage();
      setResetSetting(false);
      window.location.reload();
    }
  }, [resetSetting]);

  function handleDisplaySetting() {
    setDisplaySetting(isDisplay => !isDisplay);
  }

  function handleChangeTime(e) {
    const { name, value } = e.target;
    setTimeSet(prevTimeSet => (
      {
        ...prevTimeSet,
        [name]: Number(value)
      }
    ))
  }

  function updateToLocalStorage() {
    localStorage.setItem('time', JSON.stringify(timeSet));
  }

  function updateFromLocalStorage() {
    const previousTime = JSON.parse(localStorage.getItem('time'));
    setTimeSet(previousTime);
  }

  console.log(timeSet);

  function handleSaveTime(e) {
    updateToLocalStorage();
  }

  function handleFactoryReset() {
    setTimeSet({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15
    });
    setResetSetting(true);
  }

  const TimeSettingInput = (
    <>
      <div onClick={handleDisplaySetting} className='shadow-pop-up'></div>
      <div className='time-setting-container'>
        <FontAwesomeIcon onClick={handleDisplaySetting} className='close-setting-icon' icon={faTimes} />
        <h2 className='title-time-setting'>Set Up Time</h2>
        <form onSubmit={handleSaveTime}>
          <label htmlFor='pomodoro'>Pomodoro</label>
          <input type='number' id='pomodoro' name='pomodoro' value={timeSet.pomodoro === 0 ? '' : timeSet.pomodoro} onChange={handleChangeTime} />

          <label htmlFor='shortBreak'>Short Break</label>
          <input type='number' id='shortBreak' name='shortBreak' value={timeSet.shortBreak === 0 ? '' : timeSet.shortBreak} onChange={handleChangeTime} />

          <label htmlFor='longBreak'>Long Break</label>
          <input type='number' id='longBreak' name='longBreak' value={timeSet.longBreak === 0 ? '' : timeSet.longBreak} onChange={handleChangeTime} />

          <button className='submit-time-setting'>Save Setting</button>
        </form>
        <h4 onClick={handleFactoryReset} className='reset-setting'>Reset setting</h4>
      </div>
    </>
  )

  return (
    <header>
      <h1 className='header-title'>
        <FontAwesomeIcon className='header-icon' icon={faLeaf} />
        Pomodoro
      </h1>
      <FontAwesomeIcon onClick={handleDisplaySetting} className='header-icon' icon={faHourglassStart} />
      {displaySetting && TimeSettingInput}
    </header>
  );
}