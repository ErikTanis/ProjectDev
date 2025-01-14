import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "~hooks/useAuth";

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, error: authError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Total number of form steps

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (password !== passwordConfirm) {
        setMatchError("Passwords do not match");
        return;
      }
      const success = await register({
        username,
        password,
        email,
        firstName,
        lastName,
      });
      if (success) {
        await login({ username, password });
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter first name"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter last name"
            />
          </div>
        );
      case 3:
        return (
          <div>
            <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="name@company.com"
            />
          </div>
        );
      case 4:
        return (
          <div>
            <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter username"
            />
          </div>
        );
      case 5:
        return (
          <div>
            <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>
        );
      case 6:
        return (
          <>
            <div>
              <label className="text-gray-800 dark:text-white text-sm font-semibold block mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="w-full bg-gray-50 border-2 text-gray-900 text-sm focus:border-primary-600 pl-4 pr-12 py-3.5 outline-none rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-3 text-sm">
                <label className="font-light text-gray-500 dark:text-gray-300">
                  I accept the{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="./terms-and-conditions"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="md:h-screen font-[sans-serif] p-4 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col justify-center items-center h-full">
        <div className="grid md:grid-cols-2 items-center gap-y-8 max-w-7xl w-full shadow-[0_2px_13px_-6px_rgba(0,0,0,0.4)] rounded-xl relative overflow-hidden">
          <div className="max-md:order-1 p-4 bg-gray-50 dark:bg-gray-800 h-full">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="max-w-[90%] w-full h-full object-contain block mx-auto"
              alt="login-image"
            />
          </div>

          <div className="flex items-center p-6 max-w-md w-full h-full mx-auto">
            <form
              className="w-full space-y-4 md:space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="lg:mb-12 mb-8">
                <h3 className="text-primary-600 dark:text-white lg:text-3xl text-2xl font-extrabold max-md:text-center">
                  Create an account
                </h3>
              </div>

              {(authError || matchError) && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {authError || matchError}
                </div>
              )}

              {renderStep()}

              <div className="flex justify-between gap-4 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3.5 px-4 text-base tracking-wide rounded-xl border-2 border-primary-600 text-primary-600 hover:bg-gray-50 focus:outline-none transition-all"
                  >
                    Previous
                  </button>
                )}
                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 shadow-xl py-3.5 px-4 text-base tracking-wide rounded-xl bg-primary-600 hover:bg-primary-700 text-white border focus:outline-none transition-all"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 shadow-xl py-3.5 px-4 text-base tracking-wide rounded-xl bg-primary-600 hover:bg-primary-700 text-white border focus:outline-none transition-all"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 mt-8">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full cursor-pointer ${
                      i + 1 === step ? "bg-primary-600" : "bg-gray-300"
                    }`}
                    onClick={() => setStep(i + 1)}
                  ></div>
                ))}
              </div>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                Already have an account?{" "}
                <a
                  href="./login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
          <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary-400 max-sm:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
