import React, { useState, useEffect } from 'react';
import { faCheck, faExclamationCircle, faHourglassStart, faStopwatch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Main from './Main';

export default function Header() {
  const [timeSet, setTimeSet] = useState({
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  });
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
    const popUp = document.querySelector('.shadow-pop-up');
    const setting = document.querySelector('.time-setting-container');

    popUp.classList.toggle('active');
    setting.classList.toggle('active');
  }

  function handleChangeTime(e) {
    const { name, value } = e.target;
    const alert = document.querySelector('.alert-max-time');
    if (value > 60) {
      alert.classList.add('active');
      setTimeout(() => {
        alert.classList.remove('active');
      }, 2000);
      return;
    }

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
    if (runningTimer === 'true') {
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
    handleDisplaySetting();
    displayFeedback();
  }

  function handleFactoryReset() {
    if (isTimerRunning()) return;
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
    handleDisplaySetting();
    displayFeedback(true);
  }

  function displayFeedback(reset = false) {
    if (reset) {
      const message = document.querySelector('.feedback-setting > h3');
      message.innerHTML = 'Successfully Reset Setting';
    }

    const feedback = document.querySelector('.feedback-setting');
    feedback.classList.toggle('active');
    setTimeout(() => {
      feedback.classList.toggle('active');
    }, 2000);
  }

  const feedbackSaveSetting = (
    <div className='feedback-setting'>
      <FontAwesomeIcon
        className='feedback-check'
        icon={faCheck}
      />
      <h3>Successfully Save New Setting</h3>
    </div>
  );

  const TimeSettingInput = (
    <>
      <div onClick={handleDisplaySetting} className='shadow-pop-up'></div>
      <div className='time-setting-container'>
        <FontAwesomeIcon onClick={handleDisplaySetting} className='close-setting-icon' icon={faTimes} />
        <h2 className='title-time-setting'>Set Up Time</h2>
        <form onSubmit={handleSaveTime}>
          <h4 className='alert-max-time'>
            <FontAwesomeIcon
              icon={faExclamationCircle}
            />
            Max time is 60 minute
          </h4>

          <label htmlFor='pomodoro'>Pomodoro</label>
          <input type='number' id='pomodoro' name='pomodoro' value={timeSet.pomodoro === 0 ? '' : timeSet.pomodoro} onChange={handleChangeTime} required />

          <label htmlFor='shortBreak'>Short Break</label>
          <input type='number' id='shortBreak' name='shortBreak' value={timeSet.shortBreak === 0 ? '' : timeSet.shortBreak} onChange={handleChangeTime} required />

          <label htmlFor='longBreak'>Long Break</label>
          <input type='number' id='longBreak' name='longBreak' value={timeSet.longBreak === 0 ? '' : timeSet.longBreak} onChange={handleChangeTime} required />

          <div className='input-permission' id='display-notif'>
            <label htmlFor='display'>Allow Display Notification*</label>
            <input type='checkbox' id='display' name='display' checked={allowNotif.display} onChange={handleChangeNotif} />
          </div>

          <div className='input-permission'>
            <label htmlFor='audio'>Allow Audio Notification</label>
            <input type='checkbox' id='audio' name='audio' checked={allowNotif.audio} onChange={handleChangeNotif} />
          </div>

          <h5>*Required permission of notification to be granted</h5>

          <button className='submit-time-setting'>Save Setting</button>
        </form>
        <h4 onClick={handleFactoryReset} className='reset-setting'>Reset setting</h4>
      </div>
    </>
  );

  const stylesHeader = {
    backgroundColor: backgroundMode === 'pomodoro'
      ? '#FF6363'
      : backgroundMode === 'shortBreak'
        ? '#4fbdba'
        : '#1572A1',
  }

  const stylesContainer = {
    borderBottomColor: backgroundMode === 'pomodoro'
      ? '#e04040'
      : backgroundMode === 'shortBreak'
        ? '#319b97'
        : '#136086',
  }

  return (
    <>
      <header style={stylesHeader}>
        <div className='header-container' style={stylesContainer}>
          <h1 className='header-title'>
            <FontAwesomeIcon className='header-icon' icon={faStopwatch} />
            Pomodoro
          </h1>
          <FontAwesomeIcon onClick={handleDisplaySetting} className='setting-icon' icon={faHourglassStart} />
          {TimeSettingInput}
        </div>
      </header>
      {feedbackSaveSetting}
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