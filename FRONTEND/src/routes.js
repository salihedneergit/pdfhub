/* eslint-disable no-unused-vars */
import React from "react";

import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import AdminUsers from './views/admin/users/index';
import App from "views/admin/course";
import Calender from "views/admin/calendar";
// import Dashboard from "views/admin/dashboard/index";

// import Dashboard from "views/admin/default";
import Dashboard from "views/admin/dashboard/index";

import UserHome from './views/user/home/index'
import Todo from './views/user/todo/index'
import Promodoro from './views/user/promodoro/index'
import Courses from './views/user/course/index'
import Flagged from "views/admin/flagged";
import SignIn from "views/auth/SignIn";

import {
  MdBarChart,
  MdPerson,
  MdLock,
} from "react-icons/md";
import { Home, LayoutDashboard, Users,FileUp,Files, LayoutDashboardIcon, CalendarRange, Timer, Library,Flag} from "lucide-react";
import PDFUpload from "views/admin/pdf";
import { Checklist } from "@mui/icons-material";
import { RiFilePdf2Fill } from "react-icons/ri";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <LayoutDashboardIcon className="h-6 w-6" />,
    component: <Dashboard />,
    showInMenu: true,
    role: "common", 
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <Users className="h-6 w-6" />,
    component: <AdminUsers />,
    showInMenu: true,
    role: "admin",
  },
  {
    name: "Upload",
    layout: "/admin",
    path: "pdf",
    icon: <FileUp className="h-6 w-6" />,
    component: <PDFUpload />,
    showInMenu: true,
    role: "admin",
  },  {
    name: "Course",
    layout: "/admin",
    path: "course",
    icon: <Files className="h-6 w-6" />,
    component: <App />,
    showInMenu: true,
    role: "admin",
  },
  {
    name: "Calendar",
    layout: "/admin",
    path: "calendar",
    icon: <CalendarRange className="h-6 w-6" />,
    component: <Calender />,
    showInMenu: true,
    role: "admin",
  },
  {
    name: "Flags",
    layout: "/admin",
    path: "flagged_user",
    icon: <Flag className="h-6 w-6" />,
    component: <Flagged />,
    showInMenu: true,
    role: "admin",
  },

  // ================= USER ROUTES =====================
  {
      name: "Dashboard",
      layout: "/user",
      path: "dashboard",
      icon: <LayoutDashboard className="h-6 w-6" />,
      component: <UserHome />,
      showInMenu: true,
    },
    {
      name: "Courses",
      layout: "/user",
      path: "courses",
      icon: <Library className="h-6 w-6" />,
      component: <Courses />,
      showInMenu: true,
    },
    {
      name: "Todo List",
      layout: "/user",
      path: "todo",
      icon: <Checklist className="h-6 w-6" />,
      component: <Todo />,
      showInMenu: true,
    },
    {
      name: "Promodoro",
      layout: "/user",
      path: "promodoro",
      icon: <Timer className="h-6 w-6" />,
      component: <Promodoro />,
      showInMenu: true,
    },
    // ================= AUTH ROUTES =====================
    {
      name: "Sign In",
      layout: "/auth",
      path: "sign-in",
      icon: <MdLock className="h-6 w-6" />,
      component: <SignIn />,
      showInMenu: false,
      role: "common", 
    },
];

export default routes;
