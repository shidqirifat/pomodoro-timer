/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import Task from './Task';

export default function Main() {
  const [mode, setMode] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [beforeStart, setBeforeStart] = useState(false);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(1);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [lapPomodoro, setLapPomodoro] = useState(0);

  useEffect(() => {
    setModeStart();
    let startCountTimer;

    if (startTimer) {
      startCountTimer = setInterval(() => {
        if (currentSecond === 0 && currentMinute === 0) {
          setStartTimer(false);
          setBeforeStart(false);

          const notifTimeout = new Notification('Pomodoro time is pass?', {
            body: 'Have a good day',
          });
          setTimeout(() => notifTimeout.close(), 10000);
          finishMode();
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

  }, [second, minute, currentSecond, currentMinute, startTimer, mode, beforeStart, lapPomodoro]);

  function activeMode(id) {
    setMode(id);
  }

  function newTime() {
    setStartTimer(isStart => !isStart);
    if (currentSecond === 0 && currentMinute === 0) setModeStart();
    if (!beforeStart) {
      setBeforeStart(true);
    }
  }

  function finishMode() {
    switch (mode) {
      case 0:
        setMode(1);
        setLapPomodoro(lapPomodoro + 1);
        localStorage.setItem('Pomodoro', JSON.stringify(lapPomodoro + 1));
        break;
      case 1:
        setMode(0);
        break;
      default:
        setMode(0);
    }
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
    if (!beforeStart) displayFirstTimer()
  }

  function displayFirstTimer() {
    setCurrentSecond(second);
    setCurrentMinute(minute);
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

        setBeforeStart(false);
        setStartTimer(false);
        activeMode(index);
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
            {currentMinute < 10 ? `0${currentMinute}` : currentMinute}
            :
            {currentSecond < 10 ? `0${currentSecond}` : currentSecond}
          </span>
        </div>
        <button
          className='timer-start'
          onClick={newTime}
        >
          {!startTimer
            ? currentSecond !== 0
              ? 'Resume'
              : 'Start'
            : 'Pause'
          }
        </button>
      </div>
      <Task lap={lapPomodoro} />
    </main>
  )
};
