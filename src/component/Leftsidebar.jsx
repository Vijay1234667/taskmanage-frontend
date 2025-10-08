import React, { useEffect } from "react";
import { Container, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../store/projectSlice";
import { fetchTasks } from "../store/taskSlice";
import { setSelectedProject } from "../store/projectFilterSlice";

const Leftsidebar = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.items) || [];
  const tasks = useSelector((state) => state.tasks.tasks) || [];
  const selectedProject = useSelector((state) => state.projectFilter.selectedProject);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

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

  const visibleTasks =
    user?.role?.toLowerCase() === "manager"
      ? tasks
      : tasks.filter(
        (t) => t.assignee.toLowerCase() === user?.name?.toLowerCase()
      );

  return (
    <section className="left-sidebar-section">
      <Container>

        <div className="sidebar">
          <div className="sidebar-menu">
            <h6 className="mt-4 fw-700 font-22 mb-3 primary-gradient-color">Projects</h6>
            <div className="filter-section">
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

            <div className="sidebar-list-item-bottom primary-gradient-border mb-2 mt-5 rounded-3">
              <div className="card border-0  bg-body-secondary ">
                <div className="card-body ">
                  <h4 className="fw-700 font-18 mb-3">Quick Stats</h4>
                  <div className="d-flex justify-content-between mb-2 sidebar-menu-list-white-line">
                    <h6 className="font-12 fw-600 ">Total Task</h6>
                    <p className="font-14 mb-0">{visibleTasks.length}</p>
                  </div>

                  <div className="d-flex justify-content-between mb-2 sidebar-menu-list-white-line">
                    <h6 className="font-12 fw-600">Completed</h6>
                    <p className="font-14 mb-0 text-success">
                      {visibleTasks.filter(
                        (t) => t.status.toLowerCase() === "complete"
                      ).length}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mb-2 sidebar-menu-list-white-line">
                    <h6 className="font-12 fw-600">Pending</h6>
                    <p className="font-14 mb-0 text-danger">
                      {visibleTasks.filter(
                        (t) => t.status.toLowerCase() === "pending"
                      ).length}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mb-2 sidebar-menu-list-white-line">
                    <h6 className="font-12 fw-600">In Progress</h6>
                    <p className="font-14 mb-0 text-danger">
                      {visibleTasks.filter(
                        (t) => t.status.toLowerCase() === "in progress"
                      ).length}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mb-1 sidebar-menu-list-white-line">
                    <h6 className="font-12 fw-600">Onhold</h6>
                    <p className="font-14 mb-0 text-primary">
                      {visibleTasks.filter(
                        (t) => t.status.toLowerCase() === "on hold"
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Leftsidebar;
