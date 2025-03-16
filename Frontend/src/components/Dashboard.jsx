// Dashboard component 
// src/components/Dashboard.js
import React from 'react';
import AddMovie from './AddMovie';
import AddActor from './AddActor';
import AddGenre from './AddGenre';

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
      <section>
        <h3>Add Movie</h3>
        <AddMovie />
      </section>
      <section>
        <h3>Add Actor</h3>
        <AddActor />
      </section>
      <section>
        <h3>Add Genre</h3>
        <AddGenre />
      </section>
    </div>
  );
}

export default Dashboard;
