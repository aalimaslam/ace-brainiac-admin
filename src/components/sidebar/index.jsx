import React, { useState, useEffect } from "react";
import { HiOutlineSupport } from "react-icons/hi";
import {
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Home,
    Users,
    Settings,
    LogOut,
    Book,
    School,
    Award,
    FileText,
    Clipboard,
    BarChart2,
    User,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../utils/logout";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [expandedGroups, setExpandedGroups] = useState({
        analytics: false,
        settings: false,
    });

    // Close sidebar on mobile after route change
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    }, [location.pathname]);

    // Set initial state based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const iconMap = {
        home: Home,
        users: Users,
        teachers: Users,
        schools: School,
        memberships: Award,
        classes: Book,
        tests: Clipboard,
        worksheets: FileText,
        performance: BarChart2,
        settings: Settings,
        account: User,
        logout: LogOut,
        support: HiOutlineSupport,
    };

    const mainMenuLinks = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "home",
            path: "/dashboard",
        },
        {
            id: "students",
            label: "Students",
            icon: "users",
            path: "/students",
        },
        {
            id: "schools",
            label: "Schools",
            icon: "schools",
            path: "/schools",
        },
        {
            id: "memberships",
            label: "Memberships",
            icon: "memberships",
            path: "/memberships",
        },
        {
            id: "classes",
            label: "Classes",
            icon: "classes",
            path: "/classes",
        },
        {
            id: "tests",
            label: "Tests",
            icon: "tests",
            path: "/tests",
        },
        {
            id: "worksheets",
            label: "Worksheets",
            icon: "worksheets",
            path: "/worksheets",
        },
        {
            id: "performance",
            label: "Performance",
            icon: "performance",
            path: "/performance",
        },
    ];

    const bottomMenuLinks = [
        {
            id: "support",
            label: "Support",
            icon: "support",
            path: "/support",
        },
        {
            id: "logout",
            label: "Logout",
            icon: "logout",
            path: "/logout",
            action: handleLogout,
        },
    ];

    // Logout handler function
    function handleLogout() {
        logout(navigate);
    }

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    // Check if a link is active based on the current location
    const isLinkActive = (path) => {
        return location.pathname === path;
    };

    // Render sidebar links recursively
    const renderLinks = (links, level = 0) => {
        return links.map((link) => {
            const IconComponent = iconMap[link.icon];
            const isActive = isLinkActive(link.path);

            if (link.isGroup) {
                const isExpanded = expandedGroups[link.id];
                return (
                    <div key={link.id} className="mb-1">
                        <button
                            onClick={() => toggleGroup(link.id)}
                            className={`flex items-center w-full px-4 py-2 text-left transition-colors rounded-md hover:bg-hover ${
                                isOpen ? "" : "justify-center"
                            }`}
                        >
                            {IconComponent && (
                                <span className="mr-3">
                                    <IconComponent size={20} />
                                </span>
                            )}
                            {isOpen && (
                                <>
                                    <span className="flex-grow">
                                        {link.label}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </>
                            )}
                        </button>
                        {isOpen && isExpanded && (
                            <div className="ml-4 mt-1 space-y-1">
                                {renderLinks(link.children, level + 1)}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <button
                    key={link.id}
                    onClick={() =>
                        link.action ? link.action() : navigate(link.path)
                    }
                    className={`flex items-center w-full px-4 py-2 mb-1 rounded-md transition-colors ${
                        isActive
                            ? "bg-hover text-white"
                            : "text-gray-100 hover:bg-hover"
                    } ${isOpen ? "" : "justify-center"}`}
                >
                    {IconComponent && (
                        <span className={isOpen ? "mr-3" : ""}>
                            <IconComponent size={20} />
                        </span>
                    )}
                    {isOpen && <span>{link.label}</span>}
                </button>
            );
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile Header with Hamburger Button - Only visible on mobile when sidebar is closed */}
            {!isOpen && (
                <div className="fixed top-0 left-0 right-0 h-16 bg-primary text-white flex items-center px-4 z-40 md:hidden border-b border-gray-700">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-hover transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="text-lg font-bold ml-4">Ace-brainiac Admin</h1>
                </div>
            )}

            {/* Mobile Overlay - closes sidebar when clicked outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Always Fixed */}
            <div
                className={`bg-primary text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-full z-30 ${
                    isOpen ? "w-64" : "w-16"
                } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    {isOpen && (
                        <h1 className="text-xl font-bold">
                            Ace-brainiac Admin
                        </h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md hover:bg-hover transition-colors"
                        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Main Sidebar Content */}
                <div className="flex-grow p-3 overflow-y-auto">
                    <nav>{renderLinks(mainMenuLinks)}</nav>
                </div>

                {/* Bottom Menu Items */}
                <div className="p-3 border-t border-gray-700">
                    <nav>{renderLinks(bottomMenuLinks)}</nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700">
                    {isOpen ? (
                        <div className="text-sm text-gray-400">
                            Logged in as:{" "}
                            <span className="font-semibold">Admin</span>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <User size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div
                className={`flex-1 overflow-auto transition-all duration-300 ${
                    isOpen ? "md:ml-64" : "md:ml-16"
                } ${!isOpen ? "pt-16 md:pt-0" : ""}`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default Sidebar;
