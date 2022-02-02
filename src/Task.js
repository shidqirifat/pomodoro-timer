/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { faTimes, faClock, faPlusCircle, faCheckCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Task(props) {
  const getLap = JSON.parse(localStorage.getItem('Pomodoro'));
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
  }

  function clearAllTasks() {
    const confirmation = confirm('Are You sure want to delete all tasks list');

    if (!confirmation) return;

    setTasks([]);
    displayTaskMenu();
  }

  function displayTaskMenu() {
    document.querySelector('.task-menu-container').classList.toggle('active');
  }

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
        Todo
        <FontAwesomeIcon
          className='task-menu-icon'
          onClick={displayTaskMenu}
          icon={faEllipsisV}
        />
        <div className='task-menu-container'>
          <h4 onClick={clearFinishedTasks}>Clear finished tasks</h4>
          <h4 onClick={clearAllTasks}>Clear all tasks</h4>
        </div>
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
        <button className='submit-task'>
          <FontAwesomeIcon
            icon={faPlusCircle}
          />
          Add Task</button>
      </form>
    </div>
  )
}