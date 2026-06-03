import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/auth-context";
import { LandingPage } from "./landing-page";
import { Zap } from "lucide-react";

export function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/jobs", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EFF8FF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38B6FF] to-[#1a9fe8] flex items-center justify-center shadow-lg shadow-[#38B6FF]/30 animate-pulse">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="w-6 h-6 border-3 border-[#38B6FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (user) return null;

  return <LandingPage />;
}
