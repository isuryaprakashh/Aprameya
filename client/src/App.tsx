import React, { Suspense } from "react";
import { Route, Switch, Redirect, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Header from "./components/Header";
import Dock from "./components/Dock";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { usePrefetchAllData } from "./hooks/usePrefetchAllData";

// ─── Eagerly loaded: Landing page (critical path) ───
import Home from "./pages/Home";

// ─── Lazy-loaded pages: Each gets its own chunk ───
const Projects = React.lazy(() => import("./pages/Projects"));
const Blogs = React.lazy(() => import("./pages/Blogs"));
const BlogDetails = React.lazy(() => import("./pages/BlogDetails"));
const Events = React.lazy(() => import("./pages/Events"));
const Teams = React.lazy(() => import("./pages/Teams"));
const TeamMemberDetail = React.lazy(() => import("./pages/TeamMemberDetail"));
const About = React.lazy(() => import("./pages/About"));
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const NotFound = React.lazy(() => import("./pages/not-found"));
const TicketRegistration = React.lazy(() => import("./pages/TicketRegistration"));
const MyTickets = React.lazy(() => import("./pages/MyTickets"));
const AdminScanQR = React.lazy(() => import("./pages/AdminScanQR"));
const Recruitment = React.lazy(() => import("./pages/Recruitment"));
const RecruitmentApply = React.lazy(() => import("./pages/RecruitmentApply"));
const RecruitmentStatus = React.lazy(() => import("./pages/RecruitmentStatus"));
const DashboardRouter = React.lazy(() => import("./components/DashboardRouter"));

// Minimal loading fallback — matches the app's dark theme
const PageLoader = () => (
  <div className="min-h-screen bg-ink flex items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-signal border-t-transparent animate-spin" />
  </div>
);

// Routes that render as standalone pages (no header/footer)
const STANDALONE_ROUTES = ['/scan'];

// Protected route component
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
  [key: string]: any;
}

const ProtectedRoute = ({ component: Component, roles, ...rest }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
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

  // Prefetch data for all pages in the background so navigation feels instant
  usePrefetchAllData();

  return (
    <>
      <ScrollToTop />

      {/* Standalone routes (no header/footer) */}
      {isStandalone && (
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/scan">
              <ProtectedRoute component={AdminScanQR} roles={['ADMIN', 'CORE']} />
            </Route>
          </Switch>
        </Suspense>
      )}

      {/* Standard layout with header/footer */}
      {!isStandalone && (
        <div className="min-h-[100dvh] flex flex-col bg-ink text-paper selection:bg-signal-soft selection:text-paper">
          {!isDashboard && <Header />}

          <main className="flex-grow min-h-[100dvh] flex flex-col">
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/projects" component={Projects} />
                <Route path="/blogs" component={Blogs} />
                <Route path="/blogs/:id" component={BlogDetails} />
                <Route path="/events" component={Events} />
                <Route path="/teams/:id" component={TeamMemberDetail} />
                <Route path="/team/:id" component={TeamMemberDetail} />
                <Route path="/teams" component={Teams} />
                <Route path="/team" component={Teams} />
                <Route path="/recruitment" component={Recruitment} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route path="/reset-password" component={ForgotPassword} />

                <Route path="/events/:eventId/register" component={TicketRegistration} />

                <Route path="/recruitment/apply" component={RecruitmentApply} />
                <Route path="/recruitment/status" component={RecruitmentStatus} />

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
            </Suspense>
          </main>

          {!isDashboard && <Footer />}
          {!isDashboard && <Dock />}
        </div>
      )}

      <Toaster />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="aprameya-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
