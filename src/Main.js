/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';

export default function Main() {
  const [mode, setMode] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(false);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(1);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);

  useEffect(() => {
    setModeStart();

    if (pauseTimer) {
      console.log('pause');
    }

    let startCountTimer;
    if (startTimer) {
      startCountTimer = setInterval(() => {
        if (currentSecond === 0 && currentMinute === 0) {
          alert('Time is up!');
          setStartTimer(false);
        }
        else if (currentSecond === 0 && currentMinute > 0) {
          setCurrentSecond(5);
          setCurrentMinute(currentMinute - 1);
        }
        else if (currentSecond > 0) {
          setCurrentSecond(currentSecond - 1);
        }
      }, 1000);
    }

    return () => clearInterval(startCountTimer);

  }, [second, minute, currentSecond, currentMinute, startTimer, mode, pauseTimer]);

  function activeMode(id) {
    setMode(id);
  }

  function newTime() {
    setStartTimer(isStart => !isStart);
    if (currentSecond === 0 && currentMinute === 0) setModeStart();
  }

  function handlePause() {
    setPauseTimer(prevPause => !prevPause);
    setStartTimer(isStart => !isStart);
    // console.log('pause', pauseTimer);
  }

  function setModeStart() {
    switch (mode) {
      case 0:
        setMinute(1);
        break;
      case 1:
        setMinute(2);
        break;
      default:
        setMinute(3);
    }

    setSecond(0);
    // if (!startTimer && currentSecond === 0 && currentMinute === 0) displayFirstTimer();
    if (!startTimer && !pauseTimer) {
      console.log('display first');
      displayFirstTimer();
    }
  }

  function displayFirstTimer() {
    setCurrentSecond(second);
    setCurrentMinute(minute);
  }

  function resetTimer() {
    setCurrentSecond(0);
    setCurrentMinute(0);
  }

  const timerLabel = ['Pomodoro', 'Short Break', 'Long Break'];
  const labelContent = timerLabel.map((label, index) => (
    <h2
      className={mode === index ? 'active' : ''}
      key={index}
      onClick={() => {
        let switchMode = true;

        if (startTimer) switchMode = confirm('are u sure want to switch mode?');
        if (switchMode === false) return;

        setStartTimer(false);
        activeMode(index);
        resetTimer();
      }}
    >
      {label}
    </h2>
  ));

  return (
    <main>
      <div className='timer-container'>
        <div className='timer-label'>
          {labelContent}
        </div>
        <div className='timer-counter'>
          <span>
            {!startTimer
              ? minute < 10 ? `0${minute}` : minute
              : currentMinute < 10 ? `0${currentMinute}` : currentMinute}
            :
            {!startTimer
              ? second < 10 ? `0${second}` : second
              : currentSecond < 10 ? `0${currentSecond}` : currentSecond}
          </span>
        </div>
        <button
          className='timer-start'
          onClick={!startTimer ? newTime : handlePause}
        >
          {!startTimer
            ? currentSecond !== 0
              ? 'Resume'
              : 'Start'
            : 'Pause'
          }
        </button>
      </div>
    </main>
  )
};
