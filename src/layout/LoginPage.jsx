import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Col, Row } from 'react-bootstrap';
import ReportIcon from '@mui/icons-material/Report';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';

import loginleft from "../assets/image/loginleft.png";

const LoginPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleShowPassword = () => setShowPassword(prev => !prev);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        // Save BOTH user and token
        const { user, token } = res.data;
        localStorage.setItem('user', JSON.stringify({ ...user, token }));
        localStorage.setItem('token', token); // <-- IMPORTANT
        setSuccess("Login successful!");

        setTimeout(() => {
          navigate("/task"); // use react-router navigate
        }, 1000);
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <section>
      <Container>
        <div className='login-page-section d-flex justify-content-center align-items-center'>
          <Row>
            <Col md={6}>
              <img src={loginleft} className='img-fluid' alt="loginleft" />
            </Col>

            <Col md={6} className='d-flex justify-content-center flex-column'>
              <div className='login-right'>
                <div className='text-center mb-4'>
                  <h2 className="fw-700 fs-1 primary-gradient-color">Welcome</h2>
                  <p className='font-18 fw-500'>Login to your account</p>
                </div>

                {error && <div className="alert alert-danger"><ReportIcon /> {error}</div>}
                {success && <div className="alert alert-success">👍 {success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label>Email</label>
                    <div className='email-input-box'>
                      <div className='email-input-box-absolute'><EmailIcon /></div>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder='Enter your email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label>Password</label>
                    <div className='email-input-box'>
                      <div className='email-input-box-absolute'><LockOutlineIcon /></div>
                      <div className='email-input-box-absolute-showpassword'>
                        <Link onClick={handleShowPassword}>{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}</Link>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        placeholder='Enter your password'
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn login-btn w-100 mb-2">Log In</button>
                  <div className='text-center'>
                    New here? <Link to="/signup">Signup</Link>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default LoginPage;
