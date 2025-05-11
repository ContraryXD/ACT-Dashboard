import React from "react";
import { Cog6ToothIcon as IconSettings, NewspaperIcon as IconNewspaper, UserGroupIcon as IconUserGroup, EnvelopeIcon as IconEnvelope, SparklesIcon as IconSparkles, Bars3Icon as IconBars3, WrenchScrewdriverIcon as IconWrenchScrewdriver, UsersIcon as IconUsers, ChatBubbleLeftEllipsisIcon as IconChat, BellIcon as IconNotification } from "@heroicons/react/24/outline";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "communications",
    items: [
      { name: "Chat", href: "#", icon: IconChat },
      { name: "Notification", href: "#", icon: IconNotification },
    ],
  },
  {
    title: "website",
    items: [
      { name: "Partner", href: "#", icon: IconUserGroup },
      { name: "Contact", href: "#", icon: IconEnvelope },
      { name: "Interested", href: "#", icon: IconSparkles },
      { name: "Navigation", href: "#", icon: IconBars3 },
      { name: "Services", href: "#", icon: IconWrenchScrewdriver },
      { name: "Newsletters", href: "#", icon: IconNewspaper },
    ],
  },
  {
    title: "admin",
    items: [{ name: "Users", href: "#", icon: IconUsers }],
  },
  {
    title: "customization",
    items: [{ name: "Settings", href: "Settings", icon: IconSettings }],
  },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
      <a href="#">
        <img className="w-auto h-7" src="https://merakiui.com/images/logo.svg" alt="Company Logo" />
      </a>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="-mx-3 space-y-6 ">
          {navigationSections.map((section) => (
            <div className="space-y-3 " key={section.title}>
              <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">{section.title}</label>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a key={item.name} className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href={item.href}>
                    <IconComponent className="w-5 h-5" />
                    <span className="mx-2 text-sm font-medium">{item.name}</span>
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
