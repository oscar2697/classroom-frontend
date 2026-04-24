import { Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { Dumbbell, Home, LandPlot, Users, Building, Calendar, TrendingUp } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import WorkoutsList from "./pages/workouts/list";
import WorkoutsCreate from "./pages/workouts/create";
import WorkoutsSessionList from "./pages/classes/list";
import WorkoutsSessionCreate from "./pages/classes/create";
import WorkoutsSessionShow from "./pages/classes/show";
import UsersList from "./pages/users/list";
import UsersCreate from "./pages/users/create";
import UsersEditWorking from "./pages/users/edit-working";
import DepartmentsList from "./pages/departments/list";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { ChangePassword } from "./pages/auth/change-password";
import { CalendarPage } from "./pages/calendar";
import { ProgressPage } from "./pages/progress";
import { EnhancedUserList } from "./pages/users/enhanced-list";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "Ty42qb-11amGE-IWOi7b",
              }}
              resources={[
                {
                  name: 'dashboard',
                  list: '/',
                  meta: { label: 'Home', icon: <Home /> }
                },
                {
                  name: 'users',
                  list: '/users',
                  create: '/users/create',
                  edit: '/users/edit/:id',
                  meta: { label: 'Users', icon: <Users /> }
                },
                {
                  name: 'departments',
                  list: '/departments',
                  create: '/departments/create',
                  meta: { label: 'Departments', icon: <Building /> }
                },
                {
                  name: 'workouts',
                  list: '/workouts',
                  create: '/workouts/create',
                  meta: { label: 'Workouts', icon: <Dumbbell /> }
                },
                {
                  name: 'workouts-sessions',
                  list: '/sessions',
                  create: '/sessions/create',
                  show: '/sessions/show/:id',
                  meta: { label: 'Workouts Sessions', icon: <LandPlot /> }
                },
                {
                  name: 'calendar',
                  list: '/calendar',
                  meta: { label: 'Calendar', icon: <Calendar /> }
                },
                {
                  name: 'progress',
                  list: '/progress',
                  meta: { label: 'Progress', icon: <TrendingUp /> }
                },
              ]}
            >

              <Routes>
                {/* Default route - redirect to login */}
                <Route path="/" element={<Login />} />
                
                <Route path="auth" >
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="users" >
                    <Route index element={<UsersList />} />
                    <Route path="create" element={<UsersCreate />} />
                    <Route path="edit/:id" element={<UsersEditWorking />} />
                  </Route>

                  <Route path="departments" >
                    <Route index element={<DepartmentsList />} />
                  </Route>

                  <Route path="workouts" >
                    <Route index element={<WorkoutsList />} />
                    <Route path="create" element={<WorkoutsCreate />} />
                  </Route>

                  <Route path="sessions" >
                    <Route index element={<WorkoutsSessionList />} />
                    <Route path="create" element={<WorkoutsSessionCreate />} />
                    <Route path="show/:id" element={<WorkoutsSessionShow />} />
                  </Route>

                  <Route path="calendar" element={<CalendarPage />} />
                  <Route path="progress" element={<ProgressPage />} />
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>

            <DevtoolsPanel />

          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
