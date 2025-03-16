// Add Actor component 
// src/components/AddActor.js
import React, { useState } from 'react';
import axios from 'axios';

function AddActor() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4500/film/actors', {
        first_name: firstName,
        last_name: lastName,
        dob: dob || null
      });
      setMessage('Actor added successfully!');
      setFirstName('');
      setLastName('');
      setDob('');
    } catch (error) {
      console.error(error);
      setMessage('Error adding actor.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} required />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input type="date" value={dob} onChange={(e)=> setDob(e.target.value)} />
        </div>
        <button type="submit">Add Actor</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddActor;
