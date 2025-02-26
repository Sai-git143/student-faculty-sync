
import { useLocation, useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return {
    navigate,
    isActive,
    currentPath: location.pathname,
  };
}
