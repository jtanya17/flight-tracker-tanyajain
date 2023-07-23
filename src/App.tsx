import { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MapboxHome } from "./pages/mapbox-home";

const LoaderComponent = () => {
  return <div>Loading...</div>;
};

export const App = () => {
  const loaderElement = <LoaderComponent />;

  return (
    <Router>
      <Suspense fallback={loaderElement}>
        <Routes>
          <Route path="/" element={<MapboxHome />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
