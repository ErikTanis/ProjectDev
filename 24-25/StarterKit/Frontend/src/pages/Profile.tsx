import React, { useState } from "react";
import { useAuth } from "~hooks/useAuth";
import { FiUser, FiMail, FiEdit2, FiKey, FiSave, FiX } from "react-icons/fi";

const Profile = () => {
  const { user, updateUser, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateUser(formData.firstName, formData.lastName);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setIsChangingPassword(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 dark:bg-gray-700">
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <FiUser size={64} />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                @{user?.username}
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <FiMail className="text-blue-500 mr-2" size={20} />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Contact Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Username
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <FiUser className="text-blue-500 mr-2" size={20} />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Personal Information
                  </h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      First Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.firstName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">
                      Last Name
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.lastName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 mt-8">
              {!isEditing && !isChangingPassword && (
                <>
                  <button
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    onClick={() => setIsEditing(true)}
                  >
                    <FiEdit2 className="mr-2" />
                    Edit Profile
                  </button>
                  <button
                    className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <FiKey className="mr-2" />
                    Change Password
                  </button>
                </>
              )}

              {isEditing && (
                <form onSubmit={handleUpdate} className="w-full">
                  {/* Add edit form fields here */}
                </form>
              )}

              {isChangingPassword && (
                <form onSubmit={handlePasswordChange} className="w-full">
                  {/* Add password change form fields here */}
                </form>
              )}

              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
