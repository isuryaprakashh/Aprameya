import { Route, Switch, Redirect, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import DashboardRouter from "./components/DashboardRouter";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import Events from "./pages/Events";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/not-found";

import TicketRegistration from "./pages/TicketRegistration";
import MyTickets from "./pages/MyTickets";
import AdminScanQR from "./pages/AdminScanQR";
import Recruitment from "./pages/Recruitment";
import RecruitmentApply from "./pages/RecruitmentApply";
import RecruitmentStatus from "./pages/RecruitmentStatus";

// Routes that render as standalone pages (no header/footer)
const STANDALONE_ROUTES = ['/dashboard/scan'];

// Protected route component
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
  [key: string]: any;
}

const ProtectedRoute = ({ component: Component, roles, ...rest }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
};

function AppContent() {
  const [location] = useLocation();
  const isStandalone = STANDALONE_ROUTES.includes(location);
  const isDashboard = location.startsWith('/dashboard') || location.startsWith('/profile');

  return (
    <>

      {/* Standalone routes (no header/footer) */}
      {isStandalone && (
        <Switch>
          <Route path="/dashboard/scan">
            <ProtectedRoute component={AdminScanQR} roles={['ADMIN', 'CORE']} />
          </Route>
        </Switch>
      )}

      {/* Standard layout with header/footer */}
      {!isStandalone && (
        <>

          {!isDashboard && <Navbar />}
          <main className="flex-grow">
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/projects" component={Projects} />
              <Route path="/blogs" component={Blogs} />
              <Route path="/blogs/:id" component={BlogDetails} />
              <Route path="/events" component={Events} />
              <Route path="/recruitment" component={Recruitment} />
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password" component={ForgotPassword} />

              <Route path="/events/:eventId/register" component={TicketRegistration} />

              <Route path="/recruitment/apply">
                <ProtectedRoute component={RecruitmentApply} />
              </Route>

              <Route path="/recruitment/status">
                <ProtectedRoute component={RecruitmentStatus} />
              </Route>

              <Route path="/my-tickets">
                <ProtectedRoute component={MyTickets} />
              </Route>

              {/* Dashboard routes */}
              <Route path="/dashboard">
                <ProtectedRoute component={DashboardRouter} />
              </Route>
              <Route path="/dashboard/:rest*">
                <ProtectedRoute component={DashboardRouter} />
              </Route>

              <Route path="/profile">
                <ProtectedRoute component={UserProfile} />
              </Route>

              <Route component={NotFound} />
            </Switch>
          </main>
          {!isDashboard && <Footer />}
        </>
      )}

      <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
