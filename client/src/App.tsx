import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Feed from "@/pages/Feed";
import Auth from "@/pages/Auth";
import CreatePost from "@/pages/CreatePost";
import Admin from "@/pages/Admin";
import PostDetails from "@/pages/PostDetails";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/feed" component={Feed} />
      <Route path="/auth" component={Auth} />
      <Route path="/create" component={CreatePost} />
      <Route path="/admin" component={Admin} />
      <Route path="/posts/:id" component={PostDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
