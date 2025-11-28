"use client";

import { useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import "./admin-dashboard.css";

interface User {
  id: string;
  email: string;
  displayName?: string;
  banned?: boolean;
  role?: string;
}

interface Cat {
  id: string;
  name?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  [key: string]: any;
}

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bannedUsers, setBannedUsers] = useState<User[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<string>("users");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editedCatData, setEditedCatData] = useState<Cat | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUserDisplayName, setCurrentUserDisplayName] =
    useState<string>("Admin");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const usersData = await response.json();
      setUsers(usersData);
      console.log("✅ Fetched users from API:", usersData);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch banned users from API
  const fetchBannedUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/banned");
      if (!response.ok) {
        throw new Error("Failed to fetch banned users");
      }
      const bannedData = await response.json();
      setBannedUsers(bannedData);
      console.log("✅ Fetched banned users from API:", bannedData);
    } catch (error) {
      console.error("❌ Error fetching banned users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cats from API
  const fetchCats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cats");
      if (!response.ok) {
        throw new Error("Failed to fetch cats");
      }
      const catsData = await response.json();
      setCats(catsData);
      console.log("✅ Fetched cats from API:", catsData);
    } catch (error) {
      console.error("❌ Error fetching cats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCat = (cat: Cat) => {
    setEditingCatId(cat.id);
    setEditedCatData({ ...cat });
    setOpenMenuId(null); // Close menu when editing starts
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
    setEditedCatData(null);
  };

  const handleSaveCat = async () => {
    if (!editedCatData) return;

    try {
      const response = await fetch(`/api/cats/${editedCatData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCatData),
      });

      if (!response.ok) {
        throw new Error("Failed to update cat");
      }

      // Update local state
      setCats(
        cats.map((cat) => (cat.id === editedCatData.id ? editedCatData : cat))
      );
      setEditingCatId(null);
      setEditedCatData(null);
      console.log("✅ Cat updated successfully");
    } catch (error) {
      console.error("❌ Error updating cat:", error);
      alert("Failed to update cat. Please try again.");
    }
  };

  const handleInputChange = (field: keyof Cat, value: string | number) => {
    if (!editedCatData) return;
    setEditedCatData({
      ...editedCatData,
      [field]: value,
    });
  };

  const handleDeleteCat = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this cat?")) return;

    try {
      const response = await fetch(`/api/cats/${catId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cat");
      }

      // Remove from local state
      setCats(cats.filter((cat) => cat.id !== catId));
      setOpenMenuId(null);
      console.log("✅ Cat deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting cat:", error);
      alert("Failed to delete cat. Please try again.");
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm("Are you sure you want to ban this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banned: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to ban user");
      }

      // Move user from users to bannedUsers in local state
      const bannedUser = users.find((user) => user.id === userId);
      if (bannedUser) {
        setUsers(users.filter((user) => user.id !== userId));
        setBannedUsers([...bannedUsers, { ...bannedUser, banned: true }]);
      }
      setOpenMenuId(null);
      console.log("✅ User banned successfully");
    } catch (error) {
      console.error("❌ Error banning user:", error);
      alert("Failed to ban user. Please try again.");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm("Are you sure you want to unban this user?")) return;

    try {
      const response = await fetch(`/api/banned/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ banned: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to unban user");
      }

      // Move user from bannedUsers back to users in local state
      const unbannedUser = bannedUsers.find((user) => user.id === userId);
      if (unbannedUser) {
        setBannedUsers(bannedUsers.filter((user) => user.id !== userId));
        setUsers([...users, { ...unbannedUser, banned: false }]);
      }
      setOpenMenuId(null);
      console.log("✅ User unbanned successfully");
    } catch (error) {
      console.error("❌ Error unbanning user:", error);
      alert("Failed to unban user. Please try again.");
    }
  };

  const toggleMenu = (
    catId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openMenuId === catId) {
      setOpenMenuId(null);
      setMenuPosition(null);
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap to the right of the button
      });
      setOpenMenuId(catId);
    }
  };

  const handleLogout = () => {
    // Clear any auth tokens/session data
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      sessionStorage.clear();
    }
    // Redirect to home page
    window.location.href = "/";
  };

  // Load users on initial mount
  useEffect(() => {
    if (isInitialLoad) {
      setActiveView("users");
      fetchUsers();
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  // Get current user's display name
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        try {
          const response = await fetch("/api/users");
          if (response.ok) {
            const usersData = await response.json();
            const currentUser = usersData.find(
              (u: User) => u.email === user.email && u.role === "Admin"
            );
            if (currentUser && currentUser.displayName) {
              setCurrentUserDisplayName(currentUser.displayName);
            }
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openMenuId && !target.closest(".relative")) {
        setOpenMenuId(null);
      }
      if (showProfileMenu && !target.closest(".admin-profile")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, showProfileMenu]);

  useEffect(() => {
    // TypeScript types for DOM elements
    const htmlElement: HTMLHtmlElement =
      document.documentElement as HTMLHtmlElement;
    const bodyElement: HTMLBodyElement = document.body as HTMLBodyElement;
    const menuLinksElements: NodeListOf<Element> =
      document.querySelectorAll(".admin-menu a");
    const collapseBtnElement: HTMLButtonElement | null = document.querySelector(
      ".admin-menu .collapse-btn"
    ) as HTMLButtonElement | null;
    const toggleMobileMenuElement: HTMLButtonElement | null =
      document.querySelector(".toggle-mob-menu") as HTMLButtonElement | null;
    const switchInputElement: HTMLInputElement | null = document.querySelector(
      ".switch input"
    ) as HTMLInputElement | null;
    const switchLabelElement: HTMLLabelElement | null = document.querySelector(
      ".switch label"
    ) as HTMLLabelElement | null;
    const switchLabelTextElement: HTMLSpanElement | null =
      switchLabelElement?.querySelector(
        "span:last-child"
      ) as HTMLSpanElement | null;

    // Constants
    const collapsedClassName: string = "collapsed";
    const lightModeClassName: string = "light-mode";

    /*TOGGLE HEADER STATE*/
    const handleCollapseClick = function (this: HTMLButtonElement): void {
      bodyElement.classList.toggle(collapsedClassName);
      const isExpanded: boolean = this.getAttribute("aria-expanded") === "true";

      this.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      this.setAttribute(
        "aria-label",
        this.getAttribute("aria-label") === "collapse menu"
          ? "expand menu"
          : "collapse menu"
      );
    };

    /*TOGGLE MOBILE MENU*/
    const handleMobileMenuClick = function (this: HTMLButtonElement): void {
      bodyElement.classList.toggle("mob-menu-opened");
      const isExpanded: boolean = this.getAttribute("aria-expanded") === "true";

      this.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      this.setAttribute(
        "aria-label",
        this.getAttribute("aria-label") === "open menu"
          ? "close menu"
          : "open menu"
      );
    };

    /*SHOW TOOLTIP ON MENU LINK HOVER*/
    const handleMenuLinkHover = function (this: HTMLAnchorElement): void {
      if (
        bodyElement.classList.contains(collapsedClassName) &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        const span: HTMLSpanElement | null = this.querySelector(
          "span"
        ) as HTMLSpanElement | null;
        const tooltip: string | null = span?.textContent || null;

        if (tooltip) {
          this.setAttribute("title", tooltip);
        }
      } else {
        this.removeAttribute("title");
      }
    };

    /*TOGGLE LIGHT/DARK MODE*/
    const initializeDarkMode = (): void => {
      const darkModeValue: string | null = localStorage.getItem("dark-mode");

      if (darkModeValue === "false") {
        htmlElement.classList.add(lightModeClassName);
        if (switchInputElement) {
          switchInputElement.checked = false;
        }
        if (switchLabelTextElement) {
          switchLabelTextElement.textContent = "Light";
        }
      }
    };

    const toggleDarkMode = (): void => {
      htmlElement.classList.toggle(lightModeClassName);

      if (htmlElement.classList.contains(lightModeClassName)) {
        if (switchLabelTextElement) {
          switchLabelTextElement.textContent = "Light";
        }
        localStorage.setItem("dark-mode", "false");
      } else {
        if (switchLabelTextElement) {
          switchLabelTextElement.textContent = "Dark";
        }
        localStorage.setItem("dark-mode", "true");
      }
    };

    // Add event listeners
    collapseBtnElement?.addEventListener("click", handleCollapseClick);
    toggleMobileMenuElement?.addEventListener("click", handleMobileMenuClick);

    menuLinksElements.forEach((linkElement: Element): void => {
      const link = linkElement as HTMLAnchorElement;
      link.addEventListener("mouseenter", handleMenuLinkHover);
    });

    // Initialize dark mode on page load
    initializeDarkMode();

    // Add event listener for dark mode toggle
    switchInputElement?.addEventListener("input", toggleDarkMode);

    // Cleanup function
    return () => {
      collapseBtnElement?.removeEventListener("click", handleCollapseClick);
      toggleMobileMenuElement?.removeEventListener(
        "click",
        handleMobileMenuClick
      );
      menuLinksElements.forEach((linkElement: Element): void => {
        const link = linkElement as HTMLAnchorElement;
        link.removeEventListener("mouseenter", handleMenuLinkHover);
      });
      switchInputElement?.removeEventListener("input", toggleDarkMode);
    };
  }, []);

  return (
    <>
      {/* SVG Definitions */}
      <svg style={{ display: "none" }}>
        <symbol id="logo" viewBox="0 0 140 59">
          <text
            x="10"
            y="35"
            fontFamily="Arial, sans-serif"
            fontSize="24"
            fontWeight="bold"
            fill="currentColor"
          >
            CatUTA
          </text>
        </symbol>
        <symbol id="down" viewBox="0 0 16 16">
          <polygon points="3.81 4.38 8 8.57 12.19 4.38 13.71 5.91 8 11.62 2.29 5.91 3.81 4.38" />
        </symbol>
        <symbol id="users" viewBox="0 0 16 16">
          <path d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0ZM8,15a7,7,0,0,1-5.19-2.32,2.71,2.71,0,0,1,1.7-1,13.11,13.11,0,0,0,1.29-.28,2.32,2.32,0,0,0,.94-.34,1.17,1.17,0,0,0-.27-.7h0A3.61,3.61,0,0,1,5.15,7.49,3.18,3.18,0,0,1,8,4.07a3.18,3.18,0,0,1,2.86,3.42,3.6,3.6,0,0,1-1.32,2.88h0a1.13,1.13,0,0,0-.27.69,2.68,2.68,0,0,0,.93.31,10.81,10.81,0,0,0,1.28.23,2.63,2.63,0,0,1,1.78,1A7,7,0,0,1,8,15Z" />
        </symbol>
        <symbol id="collection" viewBox="0 0 16 16">
          <rect width="7" height="7" />
          <rect y="9" width="7" height="7" />
          <rect x="9" width="7" height="7" />
          <rect x="9" y="9" width="7" height="7" />
        </symbol>
        <symbol id="charts" viewBox="0 0 16 16">
          <polygon points="0.64 7.38 -0.02 6.63 2.55 4.38 4.57 5.93 9.25 0.78 12.97 4.37 15.37 2.31 16.02 3.07 12.94 5.72 9.29 2.21 4.69 7.29 2.59 5.67 0.64 7.38" />
          <rect y="9" width="2" height="7" />
          <rect x="12" y="8" width="2" height="8" />
          <rect x="8" y="6" width="2" height="10" />
          <rect x="4" y="11" width="2" height="5" />
        </symbol>
        <symbol id="comments" viewBox="0 0 16 16">
          <path d="M0,16.13V2H15V13H5.24ZM1,3V14.37L5,12h9V3Z" />
          <rect x="3" y="5" width="9" height="1" />
          <rect x="3" y="7" width="7" height="1" />
          <rect x="3" y="9" width="5" height="1" />
        </symbol>
        <symbol id="pages" viewBox="0 0 16 16">
          <rect
            x="4"
            width="12"
            height="12"
            transform="translate(20 12) rotate(-180)"
          />
          <polygon points="2 14 2 2 0 2 0 14 0 16 2 16 14 16 14 14 2 14" />
        </symbol>
        <symbol id="appearance" viewBox="0 0 16 16">
          <path d="M3,0V7A2,2,0,0,0,5,9H6v5a2,2,0,0,0,4,0V9h1a2,2,0,0,0,2-2V0Zm9,7a1,1,0,0,1-1,1H9v6a1,1,0,0,1-2,0V8H5A1,1,0,0,1,4,7V6h8ZM4,5V1H6V4H7V1H9V4h1V1h2V5Z" />
        </symbol>
        <symbol id="trends" viewBox="0 0 16 16">
          <polygon points="0.64 11.85 -0.02 11.1 2.55 8.85 4.57 10.4 9.25 5.25 12.97 8.84 15.37 6.79 16.02 7.54 12.94 10.2 9.29 6.68 4.69 11.76 2.59 10.14 0.64 11.85" />
        </symbol>
        <symbol id="settings" viewBox="0 0 16 16">
          <rect x="9.78" y="5.34" width="1" height="7.97" />
          <polygon points="7.79 6.07 10.28 1.75 12.77 6.07 7.79 6.07" />
          <rect x="4.16" y="1.75" width="1" height="7.97" />
          <polygon points="7.15 8.99 4.66 13.31 2.16 8.99 7.15 8.99" />
          <rect x="1.28" width="1" height="4.97" />
          <polygon points="3.28 4.53 1.78 7.13 0.28 4.53 3.28 4.53" />
          <rect x="12.84" y="11.03" width="1" height="4.97" />
          <polygon points="11.85 11.47 13.34 8.88 14.84 11.47 11.85 11.47" />
        </symbol>
        <symbol id="options" viewBox="0 0 16 16">
          <path d="M8,11a3,3,0,1,1,3-3A3,3,0,0,1,8,11ZM8,6a2,2,0,1,0,2,2A2,2,0,0,0,8,6Z" />
          <path d="M8.5,16h-1A1.5,1.5,0,0,1,6,14.5v-.85a5.91,5.91,0,0,1-.58-.24l-.6.6A1.54,1.54,0,0,1,2.7,14L2,13.3a1.5,1.5,0,0,1,0-2.12l.6-.6A5.91,5.91,0,0,1,2.35,10H1.5A1.5,1.5,0,0,1,0,8.5v-1A1.5,1.5,0,0,1,1.5,6h.85a5.91,5.91,0,0,1,.24-.58L2,4.82A1.5,1.5,0,0,1,2,2.7L2.7,2A1.54,1.54,0,0,1,4.82,2l.6.6A5.91,5.91,0,0,1,6,2.35V1.5A1.5,1.5,0,0,1,7.5,0h1A1.5,1.5,0,0,1,10,1.5v.85a5.91,5.91,0,0,1,.58.24l.6-.6A1.54,1.54,0,0,1,13.3,2L14,2.7a1.5,1.5,0,0,1,0,2.12l-.6.6a5.91,5.91,0,0,1,.24.58h.85A1.5,1.5,0,0,1,16,7.5v1A1.5,1.5,0,0,1,14.5,10h-.85a5.91,5.91,0,0,1-.24.58l.6.6a1.5,1.5,0,0,1,0,2.12L13.3,14a1.54,1.54,0,0,1-2.12,0l-.6-.6a5.91,5.91,0,0,1-.58.24v.85A1.5,1.5,0,0,1,8.5,16ZM5.23,12.18l.33.18a4.94,4.94,0,0,0,1.07.44l.36.1V14.5a.5.5,0,0,0,.5.5h1a.5.5,0,0,0,.5-.5V12.91l.36-.1a4.94,4.94,0,0,0,1.07-.44l.33-.18,1.12,1.12a.51.51,0,0,0,.71,0l.71-.71a.5.5,0,0,0,0-.71l-1.12-1.12.18-.33a4.94,4.94,0,0,0,.44-1.07l.1-.36H14.5a.5.5,0,0,0,.5-.5v-1a.5.5,0,0,0-.5-.5H12.91l-.1-.36a4.94,4.94,0,0,0-.44-1.07l-.18-.33L13.3,4.11a.5.5,0,0,0,0-.71L12.6,2.7a.51.51,0,0,0-.71,0L10.77,3.82l-.33-.18a4.94,4.94,0,0,0-1.07-.44L9,3.09V1.5A.5.5,0,0,0,8.5,1h-1a.5.5,0,0,0-.5.5V3.09l-.36.1a4.94,4.94,0,0,0-1.07.44l-.33.18L4.11,2.7a.51.51,0,0,0-.71,0L2.7,3.4a.5.5,0,0,0,0,.71L3.82,5.23l-.18.33a4.94,4.94,0,0,0-.44,1.07L3.09,7H1.5a.5.5,0,0,0-.5.5v1a.5.5,0,0,0,.5.5H3.09l.1.36a4.94,4.94,0,0,0,.44,1.07l.18.33L2.7,11.89a.5.5,0,0,0,0,.71l.71.71a.51.51,0,0,0,.71,0Z" />
        </symbol>
        <symbol id="collapse" viewBox="0 0 16 16">
          <polygon points="11.62 3.81 7.43 8 11.62 12.19 10.09 13.71 4.38 8 10.09 2.29 11.62 3.81" />
        </symbol>
        <symbol id="search" viewBox="0 0 16 16">
          <path d="M6.57,1A5.57,5.57,0,1,1,1,6.57,5.57,5.57,0,0,1,6.57,1m0-1a6.57,6.57,0,1,0,6.57,6.57A6.57,6.57,0,0,0,6.57,0Z" />
          <rect
            x="11.84"
            y="9.87"
            width="2"
            height="5.93"
            transform="translate(-5.32 12.84) rotate(-45)"
          />
        </symbol>
        <symbol id="plus" viewBox="0 0 16 16">
          <rect x="7" y="2" width="2" height="12" />
          <rect x="2" y="7" width="12" height="2" />
        </symbol>
        <symbol id="edit" viewBox="0 0 16 16">
          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5z" />
        </symbol>
        <symbol id="ban" viewBox="0 0 16 16">
          <circle
            cx="8"
            cy="8"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line
            x1="3"
            y1="3"
            x2="13"
            y2="13"
            stroke="currentColor"
            strokeWidth="2"
          />
        </symbol>
      </svg>

      <header className="page-header">
        <nav>
          <a href="/main/map" aria-label="CatUTA logo" className="logo">
            <svg width="140" height="49">
              <use xlinkHref="#logo"></use>
            </svg>
          </a>
          <button
            className="toggle-mob-menu"
            aria-expanded="false"
            aria-label="open menu"
          >
            <svg width="20" height="20" aria-hidden="true">
              <use xlinkHref="#down"></use>
            </svg>
          </button>
          <ul className="admin-menu">
            <li className="menu-heading">
              <h3>Admin</h3>
            </li>
            <li>
              <a
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("users");
                  fetchUsers();
                }}
              >
                <svg>
                  <use xlinkHref="#users"></use>
                </svg>
                <span>Users</span>
              </a>
            </li>
            <li>
              <a
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("cats");
                  fetchCats();
                }}
              >
                <svg>
                  <use xlinkHref="#collection"></use>
                </svg>
                <span>Cats Database</span>
              </a>
            </li>
            <li>
              <a
                href="#0"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView("banned");
                  fetchBannedUsers();
                }}
              >
                <svg>
                  <use xlinkHref="#ban"></use>
                </svg>
                <span>Banned Users</span>
              </a>
            </li>
            <li>
              <div className="switch">
                <input type="checkbox" id="mode" defaultChecked />
                <label htmlFor="mode">
                  <span></span>
                  <span>Dark</span>
                </label>
              </div>
              <button
                className="collapse-btn"
                aria-expanded="true"
                aria-label="collapse menu"
              >
                <svg aria-hidden="true">
                  <use xlinkHref="#collapse"></use>
                </svg>
                <span>Collapse</span>
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <section className="page-content">
        <div className="search-and-user">
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#333" }}>
            Welcome to Admin Dashboard
          </h2>
          <div className="admin-profile" style={{ position: "relative" }}>
            <div className="greeting">Hello, {currentUserDisplayName}!</div>
            <svg
              style={{ cursor: "pointer" }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <use xlinkHref="#users"></use>
            </svg>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  minWidth: "150px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span>🚪</span>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {activeView === "dashboard" && (
          <div className="flex items-center justify-center w-full h-full p-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                Welcome to the Admin Dashboard
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Select an option from the menu to get started
              </p>
            </div>
          </div>
        )}

        {activeView === "users" && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">User Management</h2>
            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : users.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-2/5">
                        Email
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                        Display Name
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/6">
                        Role
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/6">
                        Status
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100 break-words">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {user.email}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100">
                          {user.displayName || "N/A"}
                        </td>
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100">
                          {user.role || "user"}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                              user.banned
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.banned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-base relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(user.id, e);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            aria-label="Options"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {openMenuId === user.id && menuPosition && (
                            <div
                              className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                              }}
                            >
                              <button
                                onClick={() => handleBanUser(user.id)}
                                className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                              >
                                Ban User
                              </button>
                              <button
                                onClick={() => {
                                  console.log("Delete User:", user.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              >
                                Delete User
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No users found in database
              </div>
            )}
          </div>
        )}

        {activeView === "banned" && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Banned Users</h2>
            {loading ? (
              <div className="text-center py-8">Loading banned users...</div>
            ) : bannedUsers.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-2/5">
                        Email
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                        Display Name
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/6">
                        Role
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300 w-1/6">
                        Status
                      </th>
                      <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                    {bannedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100 break-words">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {user.email}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100">
                          {user.displayName || "N/A"}
                        </td>
                        <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100">
                          {user.role || "user"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Banned
                          </span>
                        </td>
                        <td className="px-8 py-5 text-base relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMenu(user.id, e);
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            aria-label="Options"
                          >
                            <svg
                              className="w-5 h-5 text-gray-600 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {openMenuId === user.id && menuPosition && (
                            <div
                              className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px]"
                              style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                              }}
                            >
                              <button
                                onClick={() => handleUnbanUser(user.id)}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                              >
                                Unban User
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No banned users found in database
              </div>
            )}
          </div>
        )}

        {activeView === "cats" && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Cats Database</h2>
            {loading ? (
              <div className="text-center py-8">Loading cats...</div>
            ) : cats.length > 0 ? (
              (() => {
                // Automatically detect all unique fields across all cats
                const allFields = new Set<string>();
                cats.forEach((cat) => {
                  Object.keys(cat).forEach((key) => {
                    if (key !== "id") {
                      // Always show ID separately
                      allFields.add(key);
                    }
                  });
                });

                // Convert to array and filter out fields with no data
                let activeFields = Array.from(allFields).filter((field) => {
                  return cats.some((cat) => {
                    const value = cat[field];
                    return (
                      value !== null &&
                      value !== undefined &&
                      value !== "" &&
                      value !== 0
                    );
                  });
                });

                // Reorder fields: move 'name' to appear before 'personality'
                const nameIndex = activeFields.indexOf("name");
                const personalityIndex = activeFields.indexOf("personality");
                if (
                  nameIndex !== -1 &&
                  personalityIndex !== -1 &&
                  nameIndex > personalityIndex
                ) {
                  // Remove 'name' from its current position
                  activeFields.splice(nameIndex, 1);
                  // Insert 'name' before 'personality'
                  const newPersonalityIndex =
                    activeFields.indexOf("personality");
                  activeFields.splice(newPersonalityIndex, 0, "name");
                }

                // Helper function to format field names for display
                const formatFieldName = (field: string) => {
                  return field
                    .replace(/([A-Z])/g, " $1") // Add space before capital letters
                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                    .trim();
                };

                return (
                  <div
                    className="bg-white dark:bg-gray-800 shadow-sm border-2 border-gray-300 dark:border-gray-600"
                    style={{ overflowX: "auto", overflowY: "visible" }}
                  >
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300">
                            ID
                          </th>
                          {activeFields.map((field) => (
                            <th
                              key={field}
                              className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300"
                            >
                              {formatFieldName(field)}
                            </th>
                          ))}
                          <th className="px-8 py-5 text-left text-base font-semibold text-gray-700 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                        {cats.map((cat) => {
                          const isEditing = editingCatId === cat.id;
                          const displayData =
                            isEditing && editedCatData ? editedCatData : cat;

                          return (
                            <tr
                              key={cat.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <td className="px-8 py-5 text-base text-gray-900 dark:text-gray-100">
                                {cat.id}
                              </td>
                              {activeFields.map((field) => (
                                <td
                                  key={field}
                                  className="px-8 py-5 text-base text-gray-900 dark:text-gray-100"
                                >
                                  {isEditing ? (
                                    <input
                                      type={
                                        typeof displayData[field] === "number"
                                          ? "number"
                                          : "text"
                                      }
                                      value={displayData[field] ?? ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          field,
                                          typeof displayData[field] === "number"
                                            ? parseInt(e.target.value) || 0
                                            : e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                  ) : (
                                    displayData[field] ?? "N/A"
                                  )}
                                </td>
                              ))}
                              <td className="px-8 py-5 text-base relative">
                                {isEditing ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleSaveCat}
                                      className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-5 py-2.5 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleMenu(cat.id, e);
                                      }}
                                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                      aria-label="Options"
                                    >
                                      <svg
                                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <circle cx="8" cy="3" r="1.5" />
                                        <circle cx="8" cy="8" r="1.5" />
                                        <circle cx="8" cy="13" r="1.5" />
                                      </svg>
                                    </button>
                                    {openMenuId === cat.id && menuPosition && (
                                      <div
                                        className="fixed bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 w-48"
                                        style={{
                                          top: `${menuPosition.top}px`,
                                          left: `${menuPosition.left}px`,
                                          zIndex: 9999,
                                        }}
                                      >
                                        <div className="py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditCat(cat);
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors block"
                                          >
                                            Update Cat
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteCat(cat.id);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors block"
                                          >
                                            Delete Cat
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-8 text-gray-600">
                No cats found in database
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
}
