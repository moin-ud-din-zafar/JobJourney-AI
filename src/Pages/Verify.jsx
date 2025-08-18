// src/pages/Verify.jsx
// import React, { useEffect, useState } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import * as api from '../api'; // adjust if your api path differs

// export default function Verify() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const navigate = useNavigate();
//   const [message, setMessage] = useState('Verifying...');

//   useEffect(() => {
//     if (!token) {
//       setMessage('Missing token in URL');
//       return;
//     }
//     (async () => {
//       try {
//         // call backend verify endpoint (this will either redirect server-side or return a success)
//         await api.verify(token);
//         setMessage('Email verified! Redirecting to sign in...');
//         setTimeout(() => navigate('/login?verified=1'), 1500);
//       } catch (err) {
//         setMessage(err?.response?.data?.error || 'Verification failed');
//       }
//     })();
//   }, [token, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
//         <h3 className="text-lg font-semibold mb-4">Email Verification</h3>
//         <p>{message}</p>
//       </div>
//     </div>
//   );
// }
