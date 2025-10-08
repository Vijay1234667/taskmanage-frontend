// // ForgotPassword.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     try {
//       const res = await axios.post('http://localhost:5000/forgot-password', { email });
//       setMessage(res.data.message);
//     } catch (err) {
//           console.error("Signup Error:", err);  // ← Add this

//       setError(err.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>Forgot Password</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           className="form-control mb-3"
//         />
//         <button type="submit" className="btn btn-primary">Send Reset Link</button>
//       </form>
//       {message && <div className="alert alert-success mt-3">{message}</div>}
//       {error && <div className="alert alert-danger mt-3">{error}</div>}
//     </div>
//   );
// };

// export default ForgotPassword;
