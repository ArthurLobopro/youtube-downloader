import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import { DownloadPage } from "./pages/Download";
import { Main } from "./pages/Main";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Main} />
        <Route path="/download" Component={DownloadPage} />
      </Routes>
    </Router>
  );
}
