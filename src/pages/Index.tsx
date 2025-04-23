import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/companies', { replace: true });
    } else if (isAuthenticated === false) {
      navigate('/login', { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-recruitflow-beige">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">RecruitFlow CRM</h1>
        <p className="text-xl text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
