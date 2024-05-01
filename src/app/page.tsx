"use client";
import { Home } from "./components/Home/Home";
import { useIsMobile } from "./hooks/isMobile";

const App = () => {
  const isMobile = useIsMobile();

  return <Home isMobile={isMobile} />;
};

export default App;
