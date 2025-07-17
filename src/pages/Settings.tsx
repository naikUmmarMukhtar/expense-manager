import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Mail,
  User,
  Lock,
  Bell,
  Sun,
  Moon,
  Trash2,
} from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center  min-h-screen px-4">
      <div className="bg-white w-full  p-6  space-y-6 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-1 text-red-600 hover:underline text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4" />
            <span>{user?.name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4" />
            <span>{user?.email || "N/A"}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Security</h2>
          <button className="flex items-center gap-2 text-amber-600 hover:underline">
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Notifications</h2>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              className="accent-amber-500"
              defaultChecked
            />
            <Bell className="w-4 h-4" />
            Email Alerts
          </label>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Appearance</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-yellow-600">
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-yellow-600">
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>

        <div className="space-y-2 border-t pt-4 border-gray-200">
          <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
          <button className="flex items-center gap-2 text-red-600 hover:underline">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
