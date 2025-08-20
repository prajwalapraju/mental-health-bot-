import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Mood from "@/pages/mood";
import Journal from "@/pages/journal";
import Progress from "@/pages/progress";
import Hobbies from "@/pages/hobbies";
import RealmJoy from "@/pages/realm-joy";
import RealmWisdom from "@/pages/realm-wisdom";
import RealmSerenity from "@/pages/realm-serenity";
import RealmConnection from "@/pages/realm-connection";
import RealmMemories from "@/pages/realm-memories";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/bottom-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

function Router() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen pb-16 lg:pb-0">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/mood" component={Mood} />
        <Route path="/journal" component={Journal} />
        <Route path="/progress" component={Progress} />
        <Route path="/hobbies" component={Hobbies} />
        <Route path="/realm-joy" component={RealmJoy} />
        <Route path="/realm-wisdom" component={RealmWisdom} />
        <Route path="/realm-serenity" component={RealmSerenity} />
        <Route path="/realm-connection" component={RealmConnection} />
        <Route path="/realm-memories" component={RealmMemories} />
        <Route component={NotFound} />
      </Switch>
      {isMobile && <BottomNavigation />}
    </div>
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
