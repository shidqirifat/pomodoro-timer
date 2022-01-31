import React, { useState, useEffect } from 'react';

export default function Main() {
  const [mode, setMode] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [currentMinute, setCurrentMinute] = useState(1);

  useEffect(() => {
    setModeStart();

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
      }, 1000)
    }

    return () => clearInterval(startCountTimer);
  }, [second, minute, currentSecond, currentMinute, startTimer, mode]);

  function activeMode(id) {
    setMode(id);
  }

  function newTime() {
    if (currentSecond === 0 && currentMinute === 0) setModeStart();
    setStartTimer(isStart => !isStart);
  }

  function setModeStart() {
    switch (mode) {
      case 0:
        startPomodoro();
        break;
      case 1:
        startShortBreak();
        break;
      default:
        startLongBreak();
    }
  }

  function displayFirstTimer() {
    setCurrentSecond(second);
    setCurrentMinute(minute);
  }

  function startPomodoro() {
    setSecond(0);
    setMinute(1);
    if (!startTimer) displayFirstTimer();
  }

  function startShortBreak() {
    setSecond(0);
    setMinute(2);
    if (!startTimer) displayFirstTimer();
  }

  function startLongBreak() {
    setSecond(0);
    setMinute(3);
    if (!startTimer) displayFirstTimer();
  }

  const timerLabel = ['Pomodoro', 'Short Break', 'Long Break'];
  const labelContent = timerLabel.map((label, index) => (
    <h2
      className={mode === index ? 'active' : ''}
      key={index}
      onClick={() => {
        activeMode(index);
        setModeStart();
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
    </main>
  )
};
