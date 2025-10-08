import { useEffect, useState } from "react";
import { Col, Container, Row, Table, Modal, Form, Button } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects, addProject, updateProject, deleteProject,
} from "../store/projectSlice";

import logo from "../assets/image/logo.svg"
import { Link } from "react-router-dom";

const ProjectPage = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items);

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleShowModal = (project = null) => {
    setFormData(project || { name: "" });
    setEditingProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isDuplicate = projects.some(
      (p) => p.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
    );

    if (!editingProject && isDuplicate) {
      alert("This project already exists!");
      return;
    }

    try {
      if (editingProject) {
        await dispatch(updateProject({ id: editingProject.id, data: formData })).unwrap();
      } else {
        await dispatch(addProject(formData)).unwrap();
      }
      handleCloseModal();
    } catch (err) {
      alert("Failed to save project. See console for error.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject(id)).unwrap();
      } catch (err) {
        alert("Failed to delete project.");
      }
    }
  };

  return (
    <>
      <section className="mt-80">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="taskmain-heading mt-3">All Project List</h5>
            <div className="task-tp-wrapper">
              {(user?.role === "manager" ? (
                <Button onClick={() => handleShowModal()} className="btn primary-gradient-sm-btn"> + Add Project</Button>
              ) : (
                <span></span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="project-page-section ">
        <Container>
          <Row>
            {Array.isArray(projects) && projects.map((project) => (
              <Col key={project.id} md={4} sm={6} xs={12} className="mb-4">
                <div className="card shadow-sm rounded-3">
                  <div className="card-body">
                    <h6 className="info-label">{project.name}</h6>
                    {(user?.role === "manager" ? (
                      <div className="d-flex justify-content-end gap-2">
                        <a onClick={() => handleShowModal(project)} href="#">
                          <EditIcon />
                        </a>
                        <a className="text-danger" onClick={() => handleDelete(project.id)} href="#">
                          <DeleteForeverIcon />
                        </a>
                      </div>
                    ) : (
                      <span></span>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Modal show={showModal} onHide={handleCloseModal} className="task-modal-body-content">
        <Modal.Header closeButton>
          <Modal.Title className="font-18 fw-500">{editingProject ? "Edit Project" : "Add Project"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProject ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectPage;
