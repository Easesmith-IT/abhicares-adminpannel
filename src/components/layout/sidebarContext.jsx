import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export const SidebarLayoutProvider = ({ children }) => {
  // Collapse State
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Selected City Scope (Workspace Switcher)
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "All Cities";
  });

  const [selectedCityId, setSelectedCityId] = useState(() => {
    return localStorage.getItem("selectedCityId") || "";
  });

  // Favorites (list of pathnames, e.g., ["/admin/bookings", ["/admin/partners"]])
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("sidebar_favorites");
    return saved ? JSON.parse(saved) : ["/admin/dashboard", "/admin/bookings"];
  });

  // Recently accessed pages (list of pathnames, e.g., ["/admin/settings"])
  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem("sidebar_recents");
    return saved ? JSON.parse(saved) : [];
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", JSON.stringify(next));
      return next;
    });
  };

  // Add / remove favorite
  const toggleFavorite = (to) => {
    setFavorites((prev) => {
      let next;
      if (prev.includes(to)) {
        next = prev.filter((p) => p !== to);
      } else {
        next = [...prev, to];
      }
      localStorage.setItem("sidebar_favorites", JSON.stringify(next));
      return next;
    });
  };

  // Add recent item (max 5 items, no duplicates, move to front)
  const addRecent = (to) => {
    if (!to || to === "/" || to.includes("/admin/logout")) return;
    setRecents((prev) => {
      const filtered = prev.filter((p) => p !== to);
      const next = [to, ...filtered].slice(0, 5);
      localStorage.setItem("sidebar_recents", JSON.stringify(next));
      return next;
    });
  };

  // Update selected city
  const changeCity = (city) => {
    if (typeof city === "object" && city !== null) {
      setSelectedCity(city.name);
      setSelectedCityId(city._id);
      localStorage.setItem("selectedCity", city.name);
      localStorage.setItem("selectedCityId", city._id);
    } else {
      setSelectedCity(city);
      if (city === "All Cities") {
        setSelectedCityId("");
        localStorage.setItem("selectedCity", "All Cities");
        localStorage.setItem("selectedCityId", "");
      } else {
        localStorage.setItem("selectedCity", city);
      }
    }
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        toggleSidebar,
        selectedCity,
        selectedCityId,
        setSelectedCity: changeCity,
        favorites,
        toggleFavorite,
        recents,
        addRecent,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useCustomSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useCustomSidebar must be used within SidebarLayoutProvider");
  }
  return context;
};
