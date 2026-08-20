import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import PostPage from "@/pages/PostPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/not-found";
import ScrollToTop from "@/components/ScrollToTop";

// import.meta.env.BASE_URL matches vite.config.ts's `base` ("/" in dev, "/marathi-bytes/" in prod)
// so routing works correctly whether the app is served at the domain root or a GitHub Pages subpath.
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/category/:category" component={CategoryPage} />
      <Route path="/post/:id" component={PostPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter base={basePath}>
          <ScrollToTop />
          <AppRoutes />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
