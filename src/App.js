import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

function App() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  const getTasks = () => {
    axios
      .get("http://localhost:3001/tasks")
      .then((res) => {
        console.log(res);
        setTasks(res.data);
      })
      .catch((err) => console.error(err));
  };

  const addTasks = () => {
    axios
      .post("http://localhost:3001/tasks", { task })
      .then((res) => {
        console.log(res);
        getTasks();
      })
      .catch((err) => console.error(err));
    setTask("");
  };

  const deleteTask = (id) => {
    const deleteConfirm = prompt(
      "Are you sure you want to delete this task? Type yes to continue"
    );
    console.log(tasks);
    if (deleteConfirm) {
      axios
        .delete(`http://localhost:3001/tasks/${id}`)
        .then((res) => {
          console.log(res);
          getTasks();
        })
        .catch((err) => console.error(err));
    }
  };

  const completeTask = (id) => {
    axios
      .patch(`http://localhost:3001/tasks/${id}`, { completed: true })
      .then((res) => {
        console.log(res);
        getTasks();
      })
      .catch((err) => console.error(err));
  };

  const pendingTask = (id) => {
    axios
      .patch(`http://localhost:3001/tasks/${id}`, { completed: false })
      .then((res) => {
        console.log(res);
        getTasks();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="Container">
      <div className="d-flex justify-content-between p-3">
        <div>
          <h1>Tasks</h1>
        </div>
        <div>
          <Button variant="primary" onClick={handleShow}>
            Click Here to Add Task
          </Button>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Enter a Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              className="my-3 p-1 form-control"
              type="text"
              placeholder="Enter task"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary"  onClick={() => {addTasks()
            handleClose()}}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <table class="table table-striped">
        <thead>
          <tr className="text-center">
            <th>TaskID</th>
            <th>TaskName</th>
            <th>Status</th>
            <th>Delete</th>
            <th>Mark as Done</th>
          </tr>
        </thead>
        {tasks.map((task) => (
          <tbody>
            <tr className="text-center">
              <td>{task.id}</td>
              <td>{task.task}</td>
              <td>{task.completed ? "Completed" : "Pending"}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </td>
              <td>
                {" "}
                {task.completed ? null : (
                  <button
                    className="btn btn-success"
                    onClick={() => completeTask(task.id)}
                  >
                    Set As Complete
                  </button>
                )}
                {task.completed ? (
                  <button
                    className="btn btn-warning"
                    onClick={() => pendingTask(task.id)}
                  >
                    Set As Pending
                  </button>
                ) : null}
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default App;
