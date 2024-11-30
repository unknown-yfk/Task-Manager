import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText, Checkbox, FormControlLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Share as ShareIcon } from '@mui/icons-material';
import axios from 'axios';
import { AxiosError } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL;


const Dashboard = () => {
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskList, setNewTaskList] = useState({ name: '', description: '' });
  const [editingTaskList, setEditingTaskList] = useState<any>(null);
  const [selectedTaskListId, setSelectedTaskListId] = useState<number | null>(null);
  const [openTaskListModal, setOpenTaskListModal] = useState(false);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '' });
  const [sharedTaskLists, setSharedTaskLists] = useState<any[]>([]);  // Added state for shared task lists

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  const fetchTaskLists = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`${API_BASE_URL}/task-lists`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaskLists(response.data);
    } catch (err) {
      console.error('Failed to fetch task lists');
    }
  };


  const [editingTask, setEditingTask] = useState<any>(null);



  const handleUpdateTask = async () => {
    if (!editingTask.name || !editingTask.description) {
      alert('Please fill out all fields!');
      return;
    }

    const token = localStorage.getItem('access_token');

    // Log the data being sent to the backend
    console.log('Sending data to backend:', {
      name: editingTask.name,
      description: editingTask.description,
      completed: editingTask.completed,
    });

    try {
      const response = await axios.put(
        `${API_BASE_URL}/task-lists/${selectedTaskListId}/tasks/${editingTask.id}`,

        {
          name: editingTask.name,
          description: editingTask.description,
          completed: editingTask.completed, // Send the completed status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? response.data : task
        )
      );
      setEditingTask(null); // Close the modal
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(

        `${API_BASE_URL}/task-lists/${selectedTaskListId}/tasks/${taskId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };


  const fetchTasksForTaskList = async (taskListId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/task-lists/${taskListId}/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks');
    }
  };

  const handleCreateTaskList = async () => {
    if (!newTaskList.name || !newTaskList.description) {
      alert('Please fill out all fields!');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(`${API_BASE_URL}/task-lists`, newTaskList, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      setTaskLists([...taskLists, response.data]);
      setNewTaskList({ name: '', description: '' });
    } catch (err) {
      console.error('Failed to create task list');
    }
  };

  const handleUpdateTaskList = async () => {
    if (!editingTaskList.name || !editingTaskList.description) {
      alert('Please fill out all fields!');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`${API_BASE_URL}/task-lists/${editingTaskList.id}`, editingTaskList, {

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      setTaskLists((prev) =>
        prev.map((list) =>
          list.id === editingTaskList.id ? response.data : list
        )
      );
      setEditingTaskList(null);
    } catch (err) {
      console.error('Failed to update task list');
    }
  };

  const handleDeleteTaskList = async (taskListId: number) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${API_BASE_URL}/task-lists/${taskListId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTaskLists((prev) => prev.filter((list) => list.id !== taskListId));
    } catch (err) {
      console.error('Failed to delete task list');
    }
  };

  const handleOpenTaskListModal = async (taskListId: number) => {
    setSelectedTaskListId(taskListId);
    await fetchTasksForTaskList(taskListId);
    setOpenTaskListModal(true);
  };

  const handleCloseTaskListModal = () => {
    setOpenTaskListModal(false);
    setTasks([]);
    setSelectedTaskListId(null);
  };

  const handleCreateTask = async () => {
    if (!newTask.name || !newTask.description) {
      alert('Please fill out all fields!');
      return;
    }

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/task-lists/${selectedTaskListId}/tasks`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks([...tasks, response.data]);
      setNewTask({ name: '', description: '' });
      setOpenTaskModal(false);
    } catch (err) {
      console.error('Failed to create task');
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);



  const handleToggleTaskCompletion = (taskId: number | string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };


  const [openShareModal, setOpenShareModal] = useState(false);
  const [shareTaskListId, setShareTaskListId] = useState<number | null>(null);
  const [shareDetails, setShareDetails] = useState({ username: '', permission: '' });

  const handleShareTaskList = (taskListId: number) => {
    setShareTaskListId(taskListId);
    setOpenShareModal(true);
  };

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
    setShareDetails({ username: '', permission: '' });
  };


  const handleShareSubmit = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/task-lists/${shareTaskListId}/share`,
        shareDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Task list shared successfully!');
      handleCloseShareModal();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.data && err.response.data.error) {
          if (err.response.data.error.includes('username')) {
            alert('Username not found!');
          } else {
            alert('Failed to share task list. Please try again.');
          }
        } else {
          alert('An error occurred. Please try again.');
        }
      } else {
        alert('An unexpected error occurred.');
      }
      console.error('Failed to share task list', err);
    }
  };



  const fetchSharedTaskLists = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/task-lists/shared-with-me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      console.log('Response from API:', response);

      setSharedTaskLists(response.data.data);
    } catch (err) {
      console.error('Failed to fetch shared task lists');
    }
  };

  useEffect(() => {
    fetchTaskLists();
    fetchSharedTaskLists();





  }, []);


  return (
    <Box>

      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>


      {/* Add Task List Form */}

      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '2.5rem',
            color: '#1976d2',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            letterSpacing: '1px',
            lineHeight: '1.4',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              color: '#0d47a1',
              transform: 'scale(1.05)',
            }
          }}
        >
          Welcome To Task Management Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} sx={{ padding: '20px' }}>

            <Card elevation={5} sx={{ padding: '5px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Task List
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  margin="normal"
                  value={newTaskList.name}
                  onChange={(e) =>
                    setNewTaskList({ ...newTaskList, name: e.target.value })
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  value={newTaskList.description}
                  onChange={(e) =>
                    setNewTaskList({
                      ...newTaskList,
                      description: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={handleCreateTaskList}
                >
                  Add Task List
                </Button>
              </CardContent>
            </Card>
          </Grid>





          {/* Task Lists
 */}
          <Grid item xs={12} sm={6} >
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Lists
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {taskLists.map((taskList, index) => (
                        <TableRow key={taskList.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleOpenTaskListModal(taskList.id)}>
                              {taskList.name}
                            </Button>
                          </TableCell>
                          <TableCell>{taskList.description}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => setEditingTaskList(taskList)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteTaskList(taskList.id)}
                            >
                              <DeleteIcon />
                            </IconButton>

                            <IconButton onClick={() => handleShareTaskList(taskList.id)}>
                              <ShareIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>



          <Grid item xs={12} sm={6} sx={{ padding: '20px' }}>
            <Card elevation={4}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Task Lists Shared with You
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Permission</TableCell> {/* New column for Permission */}
                        <TableCell>User</TableCell> {/* New column for User */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sharedTaskLists && sharedTaskLists.length > 0 ? (
                        sharedTaskLists.map((taskList, index) => {
                          // console.log('Rendering taskList:', taskList);
                          return (
                            <TableRow key={taskList.task_list.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{taskList.task_list.name}</TableCell>
                              <TableCell>{taskList.task_list.description}</TableCell>
                              <TableCell>{taskList.permission}</TableCell>
                              <TableCell>{taskList.user.name}</TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5}>No task lists shared with you</TableCell> {/* Adjusted for 5 columns */}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>



        </Grid>
      </Box>


      {/* Tasks for selected task list */}
      <Dialog open={openTaskListModal} onClose={handleCloseTaskListModal}>
        <DialogTitle>Tasks for Selected Task List</DialogTitle>



        <DialogContent>
          <List>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <ListItem
                  key={task.id}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >

                  <ListItemText
                    primary={task.name}
                    secondary={task.description}
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none', // Add line-through for completed tasks
                      color: task.completed ? 'gray' : 'inherit', // Optional: Change text color for completed tasks
                    }}
                  />

                  <Box>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleTaskCompletion(task.id)}
                          color="primary"
                        />
                      }
                      label="Completed"
                      sx={{
                        '& .MuiCheckbox-root': {
                          marginLeft: '40px', // Adjust the right margin to create space between checkbox and label
                        }
                      }}
                    />
                    <IconButton onClick={() => setEditingTask(task)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteTask(task.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Typography>No tasks available</Typography>
            )}
          </List>
        </DialogContent>




        <DialogActions>
          <Button onClick={() => setOpenTaskModal(true)}>Add Task</Button>
          <Button onClick={handleCloseTaskListModal}>Close</Button>
        </DialogActions>
      </Dialog>


      {/* Edit task modal */}

      {editingTask && (
        <Dialog open={Boolean(editingTask)} onClose={() => setEditingTask(null)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Task Name"
              fullWidth
              margin="normal"
              value={editingTask.name}
              onChange={(e) =>
                setEditingTask({ ...editingTask, name: e.target.value })
              }
            />
            <TextField
              label="Task Description"
              fullWidth
              margin="normal"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editingTask.completed}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, completed: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Completed"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingTask(null)}>Cancel</Button>
            <Button onClick={handleUpdateTask}>Update Task</Button>
          </DialogActions>
        </Dialog>
      )}



      {/* Edit Task List Modal */}
      {editingTaskList && (
        <Dialog
          open={Boolean(editingTaskList)}
          onClose={() => setEditingTaskList(null)}
        >
          <DialogTitle>Edit Task List</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={editingTaskList.name}
              onChange={(e) =>
                setEditingTaskList({
                  ...editingTaskList,
                  name: e.target.value,
                })
              }
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              value={editingTaskList.description}
              onChange={(e) =>
                setEditingTaskList({
                  ...editingTaskList,
                  description: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditingTaskList(null)}>Cancel</Button>
            <Button onClick={handleUpdateTaskList}>Update</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Task Modal */}
      <Dialog open={openTaskModal} onClose={() => setOpenTaskModal(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task Name"
            fullWidth
            margin="normal"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <TextField
            label="Task Description"
            fullWidth
            margin="normal"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskModal(false)}>Cancel</Button>
          <Button onClick={handleCreateTask}>Add Task</Button>
        </DialogActions>
      </Dialog>



      {/* share task list modal */}

      <Dialog open={openShareModal} onClose={handleCloseShareModal}>
        <DialogTitle>Share Task List</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={shareDetails.username}
            onChange={(e) =>
              setShareDetails({ ...shareDetails, username: e.target.value })
            }
          />
          <TextField
            label="Permission"
            fullWidth
            margin="normal"
            value={shareDetails.permission}
            onChange={(e) =>
              setShareDetails({ ...shareDetails, permission: e.target.value })
            }
            placeholder="view/edit"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareModal}>Cancel</Button>
          <Button onClick={handleShareSubmit}>Share</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Dashboard;
