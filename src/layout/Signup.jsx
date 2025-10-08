import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/esm/Container';
import { Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import ReportIcon from '@mui/icons-material/Report';
import loginleft from "../assets/image/loginleft.png"

const SignupPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowpassword] = useState(false);

  const handleShowpassword = () => {
    setShowpassword((prev) => !prev);
  }
  const [formData, setFormData] = useState({name: '', email: '', password: ''});
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      if (res.data.success) {
        setSuccess("Signup successful!");
        setFormData({ name: '', email: '', password: '' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message || "Signup failed.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <section>
      <div className='login-page-section d-flex justify-content-center align-items-center'>
        <Container>
          <Row>
            <Col md={6}>
              <div>
                <img src={loginleft} className='img-fluid' alt="login-left" />
              </div>
            </Col>
            <Col md={6} className='d-flex justify-content-center align-items-center flex-column'>
              <div className='login-right w-100'>
                <h2 className="mb-4 text-center font-30 fw-600">Signup</h2>
                {error && (
                  <div className=" d-flex elert-message-card py-3 px-2 rounded-2 text-start font-16 fw-500 mb-3">
                    <div>
                      <ReportIcon className='me-1' />
                    </div>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="d-flex elert-message-card py-3 px-2 rounded-2 text-start font-16 fw-500 mb-3" style={{ backgroundColor: "#d4edda", color: "#155724" }}>
                    👍{success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className='mb-2'>Name</label>
                    <div className='email-input-box'>
                      <div className='email-input-box-absolute'>
                        <AccountCircleIcon />
                      </div>
                      <input
                        name="name"
                        placeholder="Enter Your Name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className='mb-2'>Email</label>
                    <div className='d-flex  align-items-center justify-content-center email-input-box'>
                      <div className='email-input-box-absolute'>
                        <EmailIcon className='' />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className='mb-2'>Password</label>
                    <div className='email-input-box'>
                      <div className='email-input-box-absolute'>
                        <LockOutlineIcon />
                      </div>

                      <div className='email-input-box-absolute-showpassword'>
                        <Link className='text-dark' onClick={handleShowpassword}>
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </Link>
                      </div>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter Your Password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn login-btn w-100">
                    Sign Up
                  </button>
                  <p className="text-center mt-2">
                    Already have an account? <Link className='font-24 fw-700 text-dark' to="/login">Login</Link>
                  </p>
                </form>
              </div>
            </Col>

          </Row>
        </Container>
      </div>
    </section>
  );
};

export default SignupPage;
