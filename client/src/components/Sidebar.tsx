import { MessageSquare, Settings, Users, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const activeSection = currentPath.split("/")[1];
  const isSectionActive = (section: string) => {
    return activeSection === section;
  };
  return (
    <div className="w-20 bg-indigo-600 p-4 flex flex-col items-center">
      <div className="flex flex-col items-center gap-8">
        <button
          onClick={() => navigate("video")}
          className={`p-2 text-white hover:bg-indigo-700 rounded-lg transition-colors ${
            isSectionActive("video") ? "bg-indigo-700" : ""
          }`}
        >
          <Video className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate("chat")}
          className={`p-2 text-white hover:bg-indigo-700 rounded-lg transition-colors ${
            isSectionActive("chat") ? "bg-indigo-700" : ""
          }`}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate("users")}
          className={`p-2 text-white hover:bg-indigo-700 rounded-lg transition-colors ${
            isSectionActive("users") ? "bg-indigo-700" : ""
          }`}
        >
          <Users className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate("settings")}
          className={`p-2 text-white hover:bg-indigo-700 rounded-lg transition-colors ${
            isSectionActive("settings") ? "bg-indigo-700" : ""
          }`}
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
