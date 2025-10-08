import { useEffect, useState } from 'react';
import axios from 'axios';

import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

import assigneeuser from "../assets/image/assignee.svg";
import stdate from "../assets/image/stdate.svg"

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTask, deleteTask, updateTask } from '../store/taskSlice';
import { fetchProjects } from '../store/projectSlice';
import { fetchAssignees } from '../store/assigneeSlice';
import { setSelectedProject } from "../store/projectFilterSlice";
import Leftsidebar from '../component/leftsidebar';


const TaskPage = () => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const selectedProject = useSelector((state) => state.projectFilter.selectedProject);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");

    const ShowUserDetails = (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedTask(null);
    };

    const [assignee, setAssignee] = useState("");
    const handleClearFilters = () => {
        setAssignee("");
        setStatus("");
        setPriority("");
    };

    const dispatch = useDispatch();
    const tasks = useSelector(state => state.tasks.tasks);

    const [show, setShow] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', project: '', assignee: '', priority: '', status: '', start_date: '', end_date: ''
    });

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleClose = () => {
        setShow(false);
        setEditingTaskId(null);
        setFormData({
            title: '',
            description: '',
            project: '',
            assignee: '',
            priority: '',
            status: '',
            start_date: '',
            end_date: ''
        });
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const handleShow = () => {
        setFormData({
            title: "",
            description: "",
            project: "",
            assignee: user.role.toLowerCase() === "manager" ? "" : user.name,
            priority: "",
            status: "",
            start_date: "",
            end_date: ""
        });
        setEditingTaskId(null);
        setShow(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const assignees = useSelector(state => state.assignees.items) || [];

    useEffect(() => {
        dispatch(fetchAssignees());
    }, [dispatch]);

    const projects = useSelector(state => state.projects.items);
    useEffect(() => {
        dispatch(fetchTasks());
        dispatch(fetchProjects());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.project ||
            !formData.assignee || !formData.priority || !formData.status ||
            !formData.start_date || !formData.end_date) {
            alert('Please fill in all required fields');
            return;
        }
        // End date >= Start date check
        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            alert("End date cannot be earlier than Start date.");
            return;
        }

        if (editingTaskId) {
            dispatch(updateTask({ ...formData, id: editingTaskId }))
                .unwrap()
                .then(() => handleClose())
                .catch(() => alert("Failed to update task"));
        } else {
            dispatch(addTask(formData))
                .unwrap()
                .then(() => handleClose())
                .catch(() => alert("Failed to add task"));
        }
    };


    const handleDelete = async (taskId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
        const res = await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: {
                username: user.name,
                role: user.role,
            },
        });

        console.log("Deleted task response:", res.data);

        // Refresh task list
        dispatch(fetchTasks());
    } catch (error) {
        console.error("Delete error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "You are not authorized to delete this task.");
    }
};


    const formatDateForInput = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        setFormData({
            title: task.title,
            description: task.description,
            project: task.project_id,
            assignee: user.role.toLowerCase() === "manager" ? task.assignee_id : user.id,
            priority: task.priority,
            status: task.status,
            start_date: formatDateForInput(task.start_date),
            end_date: formatDateForInput(task.end_date),
        });
        setEditingTaskId(taskId);
        setShow(true);
    }
};


    const getPriorityClass = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'capsule high';
            case 'medium': return 'capsule medium';
            case 'low': return 'capsule low';
            default: return 'capsule medium';
        }
    };

    const filteredTasks = tasks.filter(task => {
        return (
            (selectedProject === "" || task.project === selectedProject) &&

            (
                user.role.toLowerCase() === "manager"
                    ? (assignee === "" || task.assignee.toLowerCase() === assignee.toLowerCase())
                    : task.assignee.toLowerCase() === user.name.toLowerCase()
            ) &&

            (status === "" || task.status.toLowerCase() === status.toLowerCase()) &&

            (priority === "" || task.priority.toLowerCase() === priority.toLowerCase())
        );
    });


    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "High1";
            case "medium":
                return "Medium1";
            case "low":
                return "Low1";
            default:
                return "secondary1";
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "secondary";
            case "in progress":
                return "primary";
            case "onhold":
                return "primary";
            case "complete":
                return "success";
            case "cancelled":
                return "danger";
            default:
                return "dark";
        }
    };


    const visibleProjects =
        user?.role?.toLowerCase() === "manager"
            ? projects
            : projects.filter((proj) =>
                tasks.some(
                    (task) =>
                        task.project === proj.name &&
                        task.assignee.toLowerCase() === user?.name?.toLowerCase()
                )
            );


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };



    return (
        <>
            <section className='main-dashboard-wrapper px-2 mt-80'>
                <Container className='p-md-0'>
                    <div>
                        <h1 className="primary-gradient-color fw-600 font-24">Task Dashboard</h1>
                        {/* <h5 className=" font-16 fw-500 mb-3"> 👋</h5> */}
                    </div>

                    <div className="test filter-wrapper bg-white py-3 px-2 flex-wrap mb-2 rounded-3">
                        <p className='mb-0 me-2 font-14 fw-600 mb-2 mb-md-0'>Website Redesign Filters:</p>
                        <div className="filter-section  mb-md-2 mb-3">
                            <div className="me-4">
                                <Form.Select
                                    value={assignee}
                                    onChange={(e) => setAssignee(e.target.value)}
                                    disabled={user.role.toLowerCase() !== "manager"}
                                >
                                    {user.role.toLowerCase() === "manager" ? (
                                        <>
                                            <option value="">All Assignees</option>
                                            {assignees.map((a) => (
                                                <option key={a.id} value={a.name}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        <option value={user.name}>{user.name}</option>
                                    )}
                                </Form.Select>
                            </div>
                        </div>
                        <div className="filter-section mb-md-2 mb-3">
                            <div className="me-4 w">
                                <Form.Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                    <option value="On Hold">On Hold</option>
                                </Form.Select>
                            </div>
                        </div>
                        <div className="filter-section mb-md-2 mb-3">
                            <div className="me-4">
                                <Form.Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="">All Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </Form.Select>
                            </div>
                        </div>

                        <div className="filter-section d-lg-none d-block mb-md-2 mb-3">
                            <Form.Select
                                value={selectedProject}
                                onChange={(e) => dispatch(setSelectedProject(e.target.value))}
                            >
                                <option value="">All Project</option>
                                {visibleProjects.map((proj) => (
                                    <option key={proj.id} value={proj.name}>
                                        {proj.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </div>

                        <Button
                            onClick={(e) => {
                                e.preventDefault(); handleClearFilters();
                            }} className="font-14  btn assign-clr-filter-btn mb-2 ms-2 text-white fw-400 ">
                            X Clear Filters
                        </Button>

                        <div className="task-tp-wrapper filter-section ms-auto mb-2">
                            <Button className="btn primary-gradient-sm-btn" onClick={handleShow}> + Add Task</Button>
                        </div>
                    </div>

                    <div className='px-2'>
                        <div className="row">
                           
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task, index) => (
                                    <div key={task.id} className="col-lg-12 col-md-12 col-sm-12 mb-2 p-0">
                                        <div className="card task-card h-100">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-12 col-md-12 mb-2">
                                                        <div className='d-flex align-items-center mb-2'>
                                                            <div>
                                                                <img src={assigneeuser} alt="assigneeuser" />
                                                            </div>
                                                            <div className='ms-2 d-flex align-items-baseline'>
                                                                <span className='font-14 fw-700 mb-0'>Project Name :</span>
                                                                <div className="mb-0 font-14 fw-500 text-capitalize ms-2 text-truncate">{task.project}</div>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex align-items-center '>
                                                            <div>
                                                                <img src={assigneeuser} alt="assigneeuser" />
                                                            </div>
                                                            <div className='ms-2 d-flex align-items-baseline'>
                                                                <span className='font-14 fw-700 mb-0'>Title :</span>
                                                                <div className="fw-400 font-14 text-truncate ms-2">{task.title}</div>
                                                            </div>
                                                        </div>
                                                        {/* 
                                                        <div className='mb-1 d-flex align-items-center'>
                                                            <div>
                                                                <img src={assigneeuser} alt="assigneeuser" />
                                                            </div>
                                                            <div className='ms-2'>
                                                                <span className='font-16 fw-700 mb-0'>Description:</span>
                                                                <div className=" fw-400 font-14 taskDescription">{task.description}</div>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 col-md-3">
                                                        <div className='d-flex align-items-center'>
                                                            <div>
                                                                <img src={assigneeuser} alt="assigneeuser" />
                                                            </div>
                                                            <div className='ms-2'>
                                                                <span className='font-14 fw-700'>Assignee</span>
                                                                <div className="fw-400 font-14 ">{task.assignee}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 col-12 mb-2 mb-md-0">
                                                        <div className='d-flex align-items-center'>
                                                            <div>
                                                                <img src={stdate} alt="assigneeuser" />
                                                            </div>
                                                            <div className='ms-2'>
                                                                <span className='font-14 fw-700 mb-0'>Start Date</span>
                                                                <div className="fw-400 font-14 text-truncate">{formatDate(task.start_date)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3 col-12 mb-2 mb-md-0">

                                                    </div>
                                                    <div className="col-md-3 col-12 mb-2 mb-md-0 text-end justify-content-end d-flex align-items-center">
                                                        <div className={`priority-badge ${getPriorityClass(task.priority)}`}>{task.priority}</div>
                                                        <span className={`badge ms-2 bg-${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card-footer p-0">
                                                {(user.role === 'manager' || user.name.toLowerCase() === task.assignee.toLowerCase()) ? (
                                                    <div className="d-flex justify-content-end">
                                                        <a
                                                            onClick={() => handleEditTask(task.id)}
                                                            href="javascript:void(0)"
                                                            className="btn btn-outline-primary btn-sm action-btn"
                                                            title="Edit Task"
                                                        >
                                                            <EditIcon className="fs-6" /> Edit Task
                                                        </a>
                                                        <a
                                                            onClick={() => handleDelete(task.id)}
                                                            href="javascript:void(0)"
                                                            className="btn btn-outline-danger btn-sm action-btn"
                                                            title="Delete Task"
                                                        >
                                                            <DeleteForeverIcon className="fs-6" /> Delete Task
                                                        </a>
                                                        <a
                                                            onClick={() => ShowUserDetails(task)}
                                                            href="javascript:void(0)"
                                                            className="btn btn-outline-primary btn-sm action-btn"
                                                            title="View Details"
                                                        >
                                                            <RemoveRedEyeIcon className="fs-6" /> View Details
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div className="text-end">
                                                        <span className="no-access">🔒 No Access</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="alert alert-warning text-center shadow-lg" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)', border: 'none' }}>
                                        <h5 className="text-danger fw-bold mb-0">🔍 No tasks found.</h5>
                                        <p className="text-muted mt-2">Try adjusting your search filters or create a new task.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </Container>

            </section>
            <Leftsidebar />
            <Modal show={show} onHide={handleClose} className='task-modal-body-content'>
                <Modal.Header closeButton>
                    <Modal.Title className="font-22   fw-600">
                        {editingTaskId ? 'Edit Task' : 'Add Task'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="mb-3" controlId="title">
                                <Form.Label className="fw-500">Title <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="title" placeholder='Title' value={formData.title} onChange={handleInputChange} required />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="mb-3" controlId="description">
                                <Form.Label className="fw-500">Description <span className="text-danger">*</span></Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder='Description' name="description" value={formData.description} onChange={handleInputChange} required />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label className="fw-500">Project <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="project" value={formData.project} onChange={handleInputChange} required>
                                    <option value="">Select Project</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.name}>{proj.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label className="fw-500">Assignee <span className="text-danger">*</span></Form.Label>
                                <Form.Select
                                    name="assignee"
                                    value={formData.assignee}
                                    onChange={handleInputChange}
                                    disabled={user.role.toLowerCase() !== "manager"}
                                    required
                                >
                                    {user.role.toLowerCase() === "manager" ? (
                                        <>
                                            <option value="">Select Assignee</option>
                                            {assignees.map((a) => (
                                                <option key={a.id} value={a.name}>
                                                    {a.name}
                                                </option>
                                            ))}
                                        </>
                                    ) : (
                                        <option value={user.name}>{user.name}</option>
                                    )}
                                </Form.Select>

                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Label className="fw-500">Priority <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="priority" value={formData.priority} onChange={handleInputChange} required>
                                    <option value="">Select Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label className="fw-500">Status <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="status" value={formData.status} onChange={handleInputChange} required>
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                    <option value="On Hold">On Hold</option>
                                </Form.Select>
                            </Col>
                        </Row>


                        <Row className="mb-3">
                            <Col>
                                <Form.Label className="fw-500">Start Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                            </Col>
                            <Col>
                                <Form.Label className="fw-500">End Date <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="date" name="end_date" value={formData.end_date} min={formData.start_date} onChange={handleInputChange} />
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <button type="submit" className="btn btn-primary">{editingTaskId ? 'Update' : 'Create'}</button>
                            </Col>
                            <Col>
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal size="lg" show={showDetailsModal} onHide={handleCloseDetails} centered>
                <Modal.Header closeButton style={{ backgroundColor: "#f0f2f5" }}>
                    <Modal.Title className="fw-bold text-dark font-14">Task Details</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ backgroundColor: "#fff" }}>
                    {selectedTask && (
                        <div className="px-2">
                            <p><strong> Title:</strong> {selectedTask.title}</p>
                            <p className='view-description-overflow'><strong className='view-description-overflow'> Description:</strong> {selectedTask.description}</p>
                            <p><strong>Project:</strong> {selectedTask.project}</p>
                            <p><strong>Assignee:</strong> {selectedTask.assignee}</p>

                            <p>
                                <strong> Priority:</strong>{" "}
                                <span className={`badge bg-${getPriorityColor(selectedTask.priority)}`}>
                                    {selectedTask.priority}
                                </span>
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`badge bg-${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </p>

                            <p><strong>Start Date:</strong> {formatDate(selectedTask.start_date)}</p>
                            <p><strong>End Date:</strong> {formatDate(selectedTask.end_date)}</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </>
    );
};

export default TaskPage;
