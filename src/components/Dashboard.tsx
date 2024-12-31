"use client"; // Mark this as a client component

import React from "react";

interface User {
  username: string;
  email: string;
  uid: number;
}

const Dashboard = ({ user }: { user: User }) => {
  if (!user) {
    return <div>Failed to load user data.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.username}!</p>
      <p>Email: {user.email}</p>
      <p>User ID: {user.uid}</p>
    </div>
  );
};

export default Dashboard;
