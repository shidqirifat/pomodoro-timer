/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { faTimes, faPlusCircle, faCheckCircle, faEllipsisV, faCheck, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Task(props) {
  const getLap = localStorage.getItem('Pomodoro');
  const getTask = JSON.parse(localStorage.getItem('Task'));
  const [newTask, setNewTask] = useState({
    id: null,
    name: '',
    value: false
  });
  const [tasks, setTasks] = useState(getTask || []);

  useEffect(() => {
    updateTaskLocalStorage();
  }, [tasks])

  function updateTaskLocalStorage() {
    localStorage.setItem('Task', JSON.stringify(tasks));
  }

  function handleNewTask(e) {
    const { name, value } = e.target;
    const alert = document.querySelector('.alert-max-input');
    if (value.length > 25) {
      alert.classList.add('active');
      setTimeout(() => {
        alert.classList.remove('active');
      }, 2000);
      return;
    }
    else alert.classList.remove('active');

    setNewTask(prevTask => ({
      ...prevTask,
      id: new Date().valueOf(),
      [name]: value
    }));
  }

  function checkTask(id) {
    let newArrayTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      const checkItem = tasks[i].id;
      if (id === checkItem) {
        const newCheck = {
          id: tasks[i].id,
          name: tasks[i].name,
          value: !tasks[i].value
        }
        newArrayTasks.push(newCheck);
      } else {
        newArrayTasks.push(tasks[i]);
      }
    }
    setTasks(newArrayTasks);
  }

  function deleteTask(id) {
    setTasks(prevTask => prevTask.filter(task => task.id !== id));
    const task = tasks.filter(task => id === task.id)[0].name;
    displayFeedback(2, task);
  }

  function submitNewTask(e) {
    e.preventDefault();
    if (newTask.name === '') return;

    setTasks(prevTask => [...prevTask, newTask]);
    setNewTask({
      id: null,
      name: '',
      value: false
    });
  }

  function clearFinishedTasks() {
    setTasks(tasks => tasks.filter(task => !task.value));
    displayTaskMenu();

    const finishTask = tasks.filter(task => task.value);
    if (finishTask.length > 0) displayFeedback(1);
  }

  function clearAllTasks() {
    if (tasks.length === 0) return;

    setTasks([]);
    displayPopUp();
    displayFeedback();
  }

  function displayFeedback(action = 0, task = false) {
    const message = document.querySelector('.feedback-clear-tasks > h3');
    if (action > 0) {
      message.innerHTML =
        action === 1
          ? 'Successfully Delete Finished Tasks'
          : `Successfully Delete ${task}`;
    } else {
      message.innerHTML = 'Successfully Delete All Task';
    }

    const feedback = document.querySelector('.feedback-clear-tasks');
    feedback.classList.add('active');
    setTimeout(() => {
      feedback.classList.toggle('active');
    }, 2000);
  }

  function displayTaskMenu() {
    document.querySelector('.task-menu-container').classList.toggle('active');
  }

  function displayPopUp() {
    const taskMenuContainer = document.querySelector('.task-menu-container');
    taskMenuContainer.classList.remove('active');

    if (tasks.length === 0) return;
    const shadow = document.querySelector('.shadow-clear');
    const popUp = document.querySelector('.pop-up-clear-tasks');
    shadow.classList.toggle('active');
    popUp.classList.toggle('active');
  }

  const popUpClearAllTasks = (
    <>
      <div onClick={displayPopUp} className='shadow-clear'></div>
      <div className='pop-up-clear-tasks'>
        <h3>Are You sure want to delete all tasks list?</h3>
        <div className='pop-up-button'>
          <button onClick={displayPopUp}>No</button>
          <button onClick={clearAllTasks}>Yes</button>
        </div>
      </div>
    </>
  );

  const feedbackClearAllTasks = (
    <div className='feedback-clear-tasks'>
      <FontAwesomeIcon
        className='feedback-check'
        icon={faCheck}
      />
      <h3>Successfully Delete All Task</h3>
    </div>
  );

  const LapPomodoro = (
    <>
      <h4 className='lap-pomodoro'>#{getLap > 0 ? getLap : props.lap}</h4>
      <h4
        className='info-mode'
      >
        {tasks.filter(task => !task.value).length > 0
          ? tasks.filter(task => !task.value)[0].name
          : props.mode === 0 ? "Time to Focus!" : "Let' take some break"
        }
      </h4>
    </>
  );
  const TaskItems = tasks.map((task) => (
    <h3
      key={task.id}
      className={task.value ? 'task-item checked' : 'task-item'}
    >
      <FontAwesomeIcon
        onClick={() => checkTask(task.id)}
        className={task.value ? 'check-task checked' : 'check-task'}
        icon={faCheckCircle}
      />
      {task.name}
      <FontAwesomeIcon
        onClick={() => deleteTask(task.id)}
        className='delete-task'
        icon={faTimes}
      />
    </h3>
  ))

  return (
    <div className='task-container'>
      {(props.lap > 0 || getLap > 0) && LapPomodoro}
      <h3
        className='task-title'
      >
        Task
        <FontAwesomeIcon
          className='task-menu-icon'
          onClick={displayTaskMenu}
          icon={faEllipsisV}
        />
        <div className='task-menu-container'>
          <h4 onClick={clearFinishedTasks}>Clear finished tasks</h4>
          <h4 onClick={displayPopUp}>Clear all tasks</h4>
        </div>
        {popUpClearAllTasks}
        {feedbackClearAllTasks}
      </h3>
      <div className='task-todo'>
        {TaskItems}
      </div>
      <form onSubmit={submitNewTask}>
        <input
          id='new-task'
          type='text'
          className='new-task'
          name='name'
          value={newTask.name}
          placeholder='New Task'
          onChange={handleNewTask}
          autoComplete='new-task'
        />
        <h4 className='alert-max-input'>
          <FontAwesomeIcon
            icon={faExclamationCircle}
          />
          Max input is 25 character
        </h4>
        <button className='submit-task'>
          <FontAwesomeIcon
            icon={faPlusCircle}
          />
          Add Task</button>
      </form>
    </div>
  )
}