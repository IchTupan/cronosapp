import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the Timer page on component mount
    navigate(createPageUrl("Timer"));
  }, [navigate]);
  
  // Return empty div as this will only render briefly before redirect
  return <div className="min-h-screen flex items-center justify-center">Redirecionando...</div>;
}
