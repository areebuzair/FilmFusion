import React, { useState } from "react";
import AddMovie from "./AddMovie";
import AddActor from "./AddActor";
import AddGenre from "./AddGenre";
import LinkActorWithMovie from "./LinkActorWithMovie";
import "./Dashboard.css";
import Header from "./Header";
import { Link } from "react-router-dom";

function CollapsibleSection({ title, children, isInitiallyOpen = false }) {
  const [isCollapsed, setIsCollapsed] = useState(!isInitiallyOpen);

  return (
    <div className="dashboard-section">
      <div
        className={`section-header ${isCollapsed ? "collapsed" : ""}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="section-title">{title}</h3>
        <span className="toggle-icon">▼</span>
      </div>
      <div className={`section-content ${isCollapsed ? "collapsed" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <div className="Header">
        <Header />
      </div>
      <div className="dashboard-container">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="dashboard-content">
          <CollapsibleSection title="Add Movie">
            <AddMovie />
          </CollapsibleSection>
          <CollapsibleSection title="Add Actor">
            <AddActor />
          </CollapsibleSection>
          <CollapsibleSection title="Add Genre">
            <AddGenre />
          </CollapsibleSection>
          <CollapsibleSection title="Assign movie to actor">
            <LinkActorWithMovie />
          </CollapsibleSection>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
