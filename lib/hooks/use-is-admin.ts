import { useEffect, useState } from "react";

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/admin-check")
      .then((res) => res.json())
      .then((data) => {
        if (data.reason === "blocked") {
          console.warn("Trop de tentatives admin, utilisateur bloqué.");
        }
        setIsAdmin(data.isAdmin);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  return isAdmin;
}

