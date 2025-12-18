import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import CreateProject from "./pages/CreateProject";
import ProjectFeed from "./pages/ProjectFeed";
import ProjectApplications from "./pages/ProjectApplications";
import MyProjects from "./pages/MyProjects";
import MyWork from "./pages/MyWork";



function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={<Register />} />

      <Route
  path="/profile"
  element={user ? <Profile /> : <Navigate to="/login" />}
      />

      <Route
  path="/my-work"
  element={user ? <MyWork /> : <Navigate to="/login" />}
/>


      <Route
  path="/project/:projectId/applications"
  element={user ? <ProjectApplications /> : <Navigate to="/login" />}
/>


      <Route
  path="/create-project"
  element={user ? <CreateProject /> : <Navigate to="/login" />}
      />

      <Route
  path="/my-projects"
  element={user ? <MyProjects /> : <Navigate to="/login" />}
/>
      
      <Route
  path="/"
  element={
    user ? (
      <>
        <Navbar />
        <ProjectFeed />
      </>
    ) : (
      <Navigate to="/register" />
    )
  }
/>

    </Routes>
  );
}

export default App;
