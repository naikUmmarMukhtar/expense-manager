import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth.currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-center bg-white-50 p-6 ">
      <div className="w-full   space-y-8 relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 flex items-center gap-1 text-red-600 hover:underline text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-sm text-gray-500">
            Manage your profile, preferences, and security.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">User Info</h2>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4" />
            <span>{user?.displayName || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4" />
            <span>{user?.email || "N/A"}</span>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Security</h2>
          <button className="flex items-center gap-2 text-amber-600 hover:underline text-sm">
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Notifications</h2>
          <label className="flex items-center gap-2 text-gray-700 text-sm">
            <input
              type="checkbox"
              className="accent-amber-500"
              defaultChecked
            />
            <Bell className="w-4 h-4" />
            Email Alerts
          </label>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-medium text-gray-700">Appearance</h2>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 text-sm">
              <Sun className="w-4 h-4" />
              Light Mode
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-yellow-600 text-sm">
              <Moon className="w-4 h-4" />
              Dark Mode
            </button>
          </div>
        </section>

        <section className="space-y-2 border-t pt-4 border-gray-200">
          <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
          <button className="flex items-center gap-2 text-red-600 hover:underline text-sm">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}
