"use client";

import React, { useState } from 'react';
// import { useRouter } from 'next/router';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  // const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = credentials;

    try {
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data) {
          localStorage.setItem('token', data);
          window.location.href = '/profile'
        } else {
          setError('No token received');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred during login: ' + error);
    }
  };

  return (
    <div className='flex flex-col h-[100vh] w-[100%] justify-center items-center hen'>
      <div className='flex flex-col items-center bg-[#00000057] p-[4em] rounded-3xl'>
        <div className='flex flex-col items-center gap-7 mb-8'>
          <h1 className='font-title text-[4em]'>WELCOME TO GRAPHQL</h1>
          {/* <h1 className='font-title text-[3em]'>PLEASE ENTER YOUR CREDENTIALS</h1> */}
        </div>
        <form onSubmit={handleLogin} className='flex flex-col gap-5 items-center'>
          <div className="form__group">
            <input type="input" className="form__field" autoComplete='off' placeholder="Username Or Email" name="username" id='username' onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} required />
            <label htmlFor="username" className="form__label">Username Or Email</label>
          </div>
          <div className="form__group">
            <input type="password" className="form__field" autoComplete='off' placeholder="Password" name="password" id='password' onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
            <label htmlFor="password" className="form__label">Password</label>
          </div>
          <button className="btn mt-5"><span>Login</span></button>
        </form>
        {error && <p className='text-red-500 font-title text-[1.4em] mt-5'>{error}</p>}
      </div>
    </div>
  );
}