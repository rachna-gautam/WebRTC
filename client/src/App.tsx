import { Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import Main from "./components/Main";
import Settings from "./components/Settings";
import User from "./components/User";
import Video from "./components/Video";
import DashboardLayout from "./layouts/DashboardLayout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route element={<DashboardLayout />}>
        <Route path="/video" element={<Video />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/users" element={<User />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
