import { Route, Switch, useLocation, Redirect } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NeuralCanvas from "./components/NeuralCanvas";
import DashboardRouter from "./components/DashboardRouter";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Blogs from "./pages/Blogs";
import Research from "./pages/Research";
import Events from "./pages/Events";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/not-found";

// Import User type
import { User } from "@shared/schema";

// Protected route component
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
  [key: string]: any;
}

const ProtectedRoute = ({ component: Component, roles, ...rest }: ProtectedRouteProps) => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/me'],
    staleTime: 5000,
  });

  const [, navigate] = useLocation();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Redirect to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to home if not authorized
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
};

// We're now using DashboardRouter component instead of redirects

function App() {
  const [location] = useLocation();
  const isHomePage = location === '/';

  // Magnetic buttons are now handled by the MagneticWrap component
  // or individual useMagnetic hooks, so we don't need global initialization.

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NeuralCanvas />
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/projects" component={Projects} />
          <Route path="/blogs" component={Blogs} />
          <Route path="/research" component={Research} />
          <Route path="/events" component={Events} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />

          {/* Dashboard routes - will route to the appropriate dashboard based on user role */}
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
      <Footer />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
