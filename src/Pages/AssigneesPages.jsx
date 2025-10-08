import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';

const AssigneesPages = () => {
  const [assignees, setAssignees] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    fetchAssignees();
  }, []);

 const fetchAssignees = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const res = await axios.get('https://taskmanage-api-backend-2.onrender.com/assignees', {
  headers: { Authorization: `Bearer ${token}` },
});


    setAssignees(res.data);
  } catch (error) {
    console.error('Failed to fetch assignees:', error);
  }
};


  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this assignee?')) {
    try {
      const token = localStorage.getItem("token"); // get the JWT from localStorage

      await axios.delete(`https://taskmanage-api-backend-2.onrender.com/assignees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }, // include JWT
      });

      fetchAssignees(); // refresh the list
    } catch (error) {
      console.error('Failed to delete assignee:', error);
    }
  }
};


  return (
    <section className="mt-80">
      <Container>
        <div>
          <h5 className="taskmain-heading mt-3 mb-3">All Assignees List</h5>
        </div>

        <Row>
          {assignees.length > 0 ? (
            assignees.map((assignee) => (
              <Col key={assignee.id} lg={4} md={6} sm={12} className="mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <h6 className="fw-bold mb-1">{assignee.name}</h6>
                    <div>
                      {(user?.role === "manager" || user.id === assignee.user_id) ? (
                        <a
                          href="#!"
                          onClick={() => handleDelete(assignee.id)}
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Assignee"
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </a>
                      ) : (
                        <span className="badge bg-secondary">No Access</span>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col>
              <div
                className="alert alert-warning text-center shadow-sm"
                style={{
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
                  border: "none",
                }}
              >
                <h6 className="text-danger fw-bold mb-1">No assignees found.</h6>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default AssigneesPages;
