/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Task from './Task';

export default function Main(props) {
  const [mode, setMode] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [beforeStart, setBeforeStart] = useState(false);
  const [runningTimer, setRunningTimer] = useState(false);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(1);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [lapPomodoro, setLapPomodoro] = useState(JSON.parse(localStorage.getItem('Pomodoro')) || 1);

  useEffect(() => {
    setModeStart();
    let startCountTimer;

    if (startTimer) {
      startCountTimer = setInterval(() => {
        if ((currentSecond === 0 && currentMinute === 0)) {
          setStartTimer(false);
          setBeforeStart(false);

          const notifTimeout = new Notification('Pomodoro time is pass?', {
            body: 'Have a good day',
          });
          setRunningTimer(false);
          localStorage.setItem('runningTimer', JSON.stringify(false));
          setTimeout(() => notifTimeout.close(), 10000);
          finishMode();
        }
        else if (currentSecond === 0 && currentMinute > 0) {
          setCurrentSecond(59);
          setCurrentMinute(currentMinute - 1);
        }
        else if (currentSecond > 0) {
          setCurrentSecond(currentSecond - 1);
        }
      }, 1000);
    }

    return () => clearInterval(startCountTimer);

  }, [second, minute, currentSecond, currentMinute, startTimer, mode, beforeStart, lapPomodoro, props.resfreshTimer, runningTimer]);

  window.onload = () => {
    localStorage.setItem('runningTimer', JSON.stringify(false));
    resetLapChangeDay();
  }

  function resetLapChangeDay() {
    const getDay = Number(localStorage.getItem('dateDay'));
    const setToday = new Date().getDate();
    if (!getDay) localStorage.setItem('dateDay', setToday);
    else if (getDay !== setToday) {
      console.log(getDay, setToday);
      console.log('first');
      localStorage.setItem('dateDay', setToday);
      localStorage.setItem('Pomodoro', 1);
    }
  }

  function activeMode(id) {
    setMode(id);

    switch (id) {
      case 0:
        props.setBackgroundMode('pomodoro');
        break;
      case 1:
        props.setBackgroundMode('shortBreak');
        break;
      default:
        props.setBackgroundMode('longBreak');
    }
  }

  function newTime() {
    setStartTimer(isStart => !isStart);
    setRunningTimer(true);
    localStorage.setItem('runningTimer', JSON.stringify(true));
    if (currentSecond === 0 && currentMinute === 0) setModeStart();
    if (!beforeStart) {
      setBeforeStart(true);
    }
  }

  function finishMode() {
    switch (mode) {
      case 0:
        setLapPomodoro(lapPomodoro + 1);
        localStorage.setItem('Pomodoro', lapPomodoro + 1);
        setMode(1);
        break;
      case 1:
        setMode(0);
        break;
      default:
        setMode(0);
    }
  }

  function setModeStart() {
    const getTimeSetting = JSON.parse(localStorage.getItem('time'));
    switch (mode) {
      case 0:
        setMinute(getTimeSetting.pomodoro);
        break;
      case 1:
        setMinute(getTimeSetting.shortBreak);
        break;
      default:
        setMinute(getTimeSetting.longBreak);
    }

    setSecond(0);
    if (!beforeStart) displayFirstTimer();
    props.setResfreshTimer(false);
  }

  function displayFirstTimer() {
    setCurrentSecond(second);
    setCurrentMinute(minute);
  }

  function handleSkipTimer(index, skipButton = false) {
    let switchMode = true;

    if (runningTimer) switchMode = confirm('are u sure want to switch mode?');
    if (switchMode === false) return;

    if (runningTimer && mode === 0) finishMode();

    setBeforeStart(false);
    setStartTimer(false);
    setRunningTimer(false);
    localStorage.setItem('runningTimer', JSON.stringify(false));
    if (!skipButton) activeMode(index);
    else activeMode(index === 0 ? 1 : 0);
  }

  const timerLabel = ['Pomodoro', 'Short Break', 'Long Break'];
  const labelContent = timerLabel.map((label, index) => (
    <h2
      className={mode === index ? 'active' : ''}
      key={index}
      onClick={() => handleSkipTimer(index)}
    >
      {label}
    </h2 >
  ));

  const stylesMain = {
    backgroundColor: props.backgroundMode === 'pomodoro'
      ? '#FF6363'
      : props.backgroundMode === 'shortBreak'
        ? '#4fbdba'
        : '#1572A1',
  }
  const stylesStart = {
    color: props.backgroundMode === 'pomodoro'
      ? '#FF6363'
      : props.backgroundMode === 'shortBreak'
        ? '#4fbdba'
        : '#1572A1',
  }

  return (
    <main style={stylesMain}>
      <div className='timer-container'>
        <div className='timer-label'>
          {labelContent}
        </div>
        <div className='timer-counter'>
          <span>
            {currentMinute < 10 ? `0${currentMinute}` : currentMinute}
            :
            {currentSecond < 10 ? `0${currentSecond}` : currentSecond}
          </span>
        </div>
        <div className='button-timer'>
          <button
            className='timer-start'
            onClick={newTime}
            style={stylesStart}
          >
            {!startTimer
              ? runningTimer
                ? 'Resume'
                : 'Start'
              : 'Pause'
            }
          </button>
          <FontAwesomeIcon
            onClick={() => handleSkipTimer(mode, true)}
            className={runningTimer && !startTimer ? 'skip-timer-button active' : 'skip-timer-button'}
            icon={faForward}
          />
        </div>
      </div>
      <Task lap={lapPomodoro} mode={mode} />
    </main>
  )
};
