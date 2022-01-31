import React, { useEffect, useState } from 'react';
import { faTimes, faCheckDouble, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
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
      id: tasks.length + 1,
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
    setTasks(prevTask => [...prevTask, newTask]);
    setNewTask({
      id: null,
      name: '',
      value: false
    });
  }

  const LapPomodoro = <h4 className='lap-pomodoro'>#{getLap > 0 ? getLap : props.lap}</h4>;
  const TaskItems = tasks.map((task) => (
    <h3
      key={task.id}
      className='task-item'
    >
      <FontAwesomeIcon
        onClick={() => checkTask(task.id)}
        className='check-task'
        icon={task.value ? faCheck : faClock}
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
      <div className='task-todo'>
        {TaskItems}
      </div>
      <form onSubmit={submitNewTask}>
        <input
          type='text'
          className='new-task'
          name='name'
          value={newTask.name}
          placeholder='New Task'
          onChange={handleNewTask}
        />
        <button className='submit-task'>Add Task</button>
      </form>
    </div>
  )
}