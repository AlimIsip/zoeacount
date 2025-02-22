import Header from "@/components/layout/NavBar";
import Body from "@/components/layout/Body";
import { handleLogin } from "@/lib/sessiondetails";

export default async function login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-950">
      <Body>
        <div className="max-w-md w-full bg-sky-900 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold text-amber-400 mb-6 text-center">
            Sign In
          </h2>

          <form className="space-y-4" action={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-1">
                Username
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-600 bg-sky-800 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-white placeholder-gray-400"
                type="text"
                name="username"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-300 mb-1">
                Password
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-600 bg-sky-800 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-white placeholder-gray-400"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              className="w-full bg-amber-400 hover:bg-amber-500 text-sky-950 font-medium py-2.5 rounded-lg transition-colors"
              type="submit"
            >
              Sign In
            </button>
          </form>
        </div>
      </Body>
    </div>
  );
}
