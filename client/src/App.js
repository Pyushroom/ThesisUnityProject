import { createBrowserRouter, RouterProvider, Outlet, redirect, Navigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Quizzes from "./pages/Quizzes";
import QuizCreate from "./pages/QuizCreate";
import QuizEdit from "./pages/QuizEdit";
import Team from "./pages/Team";
import Teams from "./pages/Teams";
import Students from "./pages/Students";
import Assigments from "./pages/Assigments";
import Assignment from "./pages/Assigment";
import AssignmentEdit from "./pages/AssignmentEdit";
import AssignmentCreate from "./pages/AssignmentCreate";
import AssignmentListCreate from "./pages/AssignmentCreateTeam";
import ViewUserResult from "./pages/ViewUserResult";
import Settings from "./pages/Settings";
import Regulations from "./pages/Regulations";
import Exercises from "./pages/Exercises";
import CookiesNotice from "./components/CookiesNotice/CookieNotice"; // Import the cookie notice component
import './styles/layout.scss';
import { AuthContext } from './context/authContext.js'


function App() {
  const [showCookiesNotice, setShowCookiesNotice] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // Add event listener to clear local storage when page is closed
    window.addEventListener('beforeunload', () => {
      localStorage.clear();
    });
  })
  
  

  const Layout = () => {
    return (
      <div className='layout-container'>
        <div className='navbar-container'>
          <Navbar />
        </div>
        <div className="content-container">
          <div className='sidebar-container'>
            <Sidebar />
          </div>
          <div className='home-container'>
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

  

  const ProtectedRoute = ({children}) =>{
    if(!currentUser){
      return <Navigate to="/login" />
    }

    return children
  }
  
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <React.Fragment>
          <CookiesNotice /> {/* Add the cookie notice component */}
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        </React.Fragment>
      ),
      children:[
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/dashboard",
          element: <Home />
        },
        {
          path: "/teams",
          element: <Teams />
        },
        {
          path: "/:teamId/assigment/create",
          element: <AssignmentCreate />
        },
        {
          path: "/:userId/assigments/assigment/create",
          element: <AssignmentListCreate />
        },
        {
          path: "/assignments",
          element: <Assigments />
        },
        {
          path: "/assignment/:id/:teamName",
          element: <Assignment />
        },
        {
          path: "/assignment/:id/view/:userId",
          element: <ViewUserResult />
        },
        {
          path: "/assignment/:id/edit/:teamName",
          element: <AssignmentEdit />
        },
        {
          path: "/quizz/create/:quizzId",
          element: <QuizCreate />
        },
        {
          path: "/quizz",
          element: <Quizzes />
        },
        {
          path: "/students",
          element: <Students />
        },
        {
          path: "/settings",
          element: <Settings />
        },
        {
          path: "/regulations",
          element: <Regulations />
        },
        {
          path: "/profile/:id",
          element: <Profile />
        },
        {
          path: "/quizz/:quizId",
          element: <Quiz />
        },
        {
          path: "/quizz/:quizzId/edit",
          element: <QuizEdit />
        },
        {
          path: "/teams/:teamId",
          element: <Team />
        },
        {
          path: "/exercises",
          element: <Exercises />
        },
        
      ]
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  

  function handleCookiesNoticeClose() {
    setShowCookiesNotice(false);
  }

  return (
    <div className="app">
      {showCookiesNotice && <CookiesNotice onClose={handleCookiesNoticeClose} />} {/* Conditionally render the cookie notice component */}
      <div className="container">
        <RouterProvider router={router}/>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
