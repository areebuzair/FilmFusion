import React from "react";
import AddMovie from "./AddMovie";
import AddActor from "./AddActor";
import AddGenre from "./AddGenre";
import "./Dashboard.css"; // Importing the updated CSS for Dashboard
import Header from "./Header";

function Dashboard() {
  return (
    <>
      <div className="Header">
        {" "}
        <Header />{" "}
      </div>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="dashboard-content">
          <section className="dashboard-section">
            <h3 className="section-title">Add Movie</h3>
            <AddMovie />
          </section>
          <section className="dashboard-section">
            <h3 className="section-title">Add Actor</h3>
            <AddActor />
          </section>
          <section className="dashboard-section">
            <h3 className="section-title">Add Genre</h3>
            <AddGenre />
          </section>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
