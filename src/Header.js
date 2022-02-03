import React, { useState, useEffect } from 'react';
import { faHourglassStart, faLeaf, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Main from './Main';

export default function Header() {
  const [timeSet, setTimeSet] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
  const [displaySetting, setDisplaySetting] = useState(false);
  const [resetSetting, setResetSetting] = useState(false);
  const [resfreshTimer, setResfreshTimer] = useState(false);
  const [displayTimer, setDisplayTimer] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState('pomodoro');
  const [allowNotif, setAllowNotif] = useState({
    display: true,
    audio: true
  });

  useEffect(() => {
    const getBackgroundMode = localStorage.getItem('backgroundMode');
    if (!getBackgroundMode || getBackgroundMode !== backgroundMode) {
      localStorage.setItem('backgroundMode', backgroundMode);
    }

    if (!localStorage.getItem('time') || !localStorage.getItem('notif-permission')) {
      updateToLocalStorage();
      setDisplayTimer(true);
    }
    else {
      updateFromLocalStorage();
      setDisplayTimer(true);
    }

    if (resetSetting || resfreshTimer) {
      updateToLocalStorage();
      setResetSetting(false);
    }
  }, [resetSetting, resfreshTimer, backgroundMode]);

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

  function handleChangeNotif(e) {
    const { name, checked } = e.target;
    setAllowNotif(prevAllow => (
      {
        ...prevAllow,
        [name]: checked
      }
    ))
  }

  function updateToLocalStorage() {
    localStorage.setItem('time', JSON.stringify(timeSet));
    localStorage.setItem('notif-permission', JSON.stringify(allowNotif));
  }

  function updateFromLocalStorage() {
    const previousTime = JSON.parse(localStorage.getItem('time'));
    const previousPermission = JSON.parse(localStorage.getItem('notif-permission'));
    setTimeSet(previousTime);
    setAllowNotif(previousPermission);
  }

  function isTimerRunning() {
    const runningTimer = localStorage.getItem('runningTimer');
    if (runningTimer) {
      alert('Timer is running now, You are can not change timer setting before the timer is finish.');
      updateFromLocalStorage();

      return true;
    }
    return false;
  }

  function handleSaveTime(e) {
    e.preventDefault();
    if (isTimerRunning()) return;

    updateToLocalStorage();
    setResfreshTimer(true);
    setDisplaySetting(isDisplay => !isDisplay);
  }

  function handleFactoryReset() {
    isTimerRunning();
    setTimeSet({
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15
    });
    setAllowNotif({
      display: true,
      audio: true
    })
    setResetSetting(true);
    setResfreshTimer(true);
    setDisplaySetting(isDisplay => !isDisplay);
  }

  const TimeSettingInput = (
    <>
      <div onClick={handleDisplaySetting} className='shadow-pop-up'></div>
      <div className='time-setting-container'>
        <FontAwesomeIcon onClick={handleDisplaySetting} className='close-setting-icon' icon={faTimes} />
        <h2 className='title-time-setting'>Set Up Time</h2>
        <form onSubmit={handleSaveTime}>
          <label htmlFor='pomodoro'>Pomodoro</label>
          <input type='number' id='pomodoro' name='pomodoro' value={timeSet.pomodoro === 0 ? '' : timeSet.pomodoro} onChange={handleChangeTime} required />

          <label htmlFor='shortBreak'>Short Break</label>
          <input type='number' id='shortBreak' name='shortBreak' value={timeSet.shortBreak === 0 ? '' : timeSet.shortBreak} onChange={handleChangeTime} required />

          <label htmlFor='longBreak'>Long Break</label>
          <input type='number' id='longBreak' name='longBreak' value={timeSet.longBreak === 0 ? '' : timeSet.longBreak} onChange={handleChangeTime} required />

          <div className='input-permission'>
            <label htmlFor='display'>Allow Display Notification</label>
            <input type='checkbox' id='display' name='display' checked={allowNotif.display} onChange={handleChangeNotif} />
          </div>

          <div className='input-permission'>
            <label htmlFor='audio'>Allow Audio Notification</label>
            <input type='checkbox' id='audio' name='audio' checked={allowNotif.audio} onChange={handleChangeNotif} />
          </div>

          <button className='submit-time-setting'>Save Setting</button>
        </form>
        <h4 onClick={handleFactoryReset} className='reset-setting'>Reset setting</h4>
      </div>
    </>
  );

  const styles = {
    backgroundColor: backgroundMode === 'pomodoro'
      ? '#FF6363'
      : backgroundMode === 'shortBreak'
        ? '#4fbdba'
        : '#1572A1',
  }

  return (
    <>
      <header style={styles}>
        <h1 className='header-title'>
          <FontAwesomeIcon className='header-icon' icon={faLeaf} />
          Pomodoro
        </h1>
        <FontAwesomeIcon onClick={handleDisplaySetting} className='setting-icon' icon={faHourglassStart} />
        {displaySetting && TimeSettingInput}
      </header>
      {displayTimer &&
        <Main
          resfreshTimer={resfreshTimer}
          setResfreshTimer={setResfreshTimer}
          backgroundMode={backgroundMode}
          setBackgroundMode={setBackgroundMode}
          allowNotif={allowNotif}
        />}
    </>
  );
}