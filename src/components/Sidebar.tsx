import React from "react";
import Image from "next/image"; // Import the Image component
import {
   Cog6ToothIcon as IconSettings,
   NewspaperIcon as IconNewspaper,
   UsersIcon as IconUsers,
   ChatBubbleLeftEllipsisIcon as IconChat,
   BellIcon as IconNotification,
   BriefcaseIcon as IconRecruitment // Added for Recruitments
} from "@heroicons/react/24/outline";

interface NavItem {
   name: string;
   href?: string; // Make href optional for dropdown toggles
   icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
   subItems?: NavItem[]; // Add subItems for dropdown functionality
}

interface NavSection {
   title: string;
   items: NavItem[];
}

const navigationSections: NavSection[] = [
   {
      title: "communications",
      items: [
         { name: "Chat", href: "/admin/chat", icon: IconChat },
         { name: "Notification", href: "/admin/notifications", icon: IconNotification }
      ]
   },
   {
      title: "Admin Management",
      items: [{ name: "Users", href: "/admin/users", icon: IconUsers }]
   },
   {
      title: "Basic Content",
      items: [
         { name: "Newsletter", href: "/newsletters", icon: IconNewspaper },
         { name: "Recruitments", href: "/recruitments", icon: IconRecruitment } // Added Recruitments
      ]
   },
   {
      title: "customization",
      items: [{ name: "Settings", href: "/Settings", icon: IconSettings }]
   }
];

export default function Sidebar() {
   return (
      <aside className="fixed top-0 left-0 z-40 flex flex-col w-45 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
         <a href="#">
            <Image src="/img/logo_ACT.png" alt="Company Logo" width={116} height={28} />
         </a>
         <div className="flex flex-col justify-between flex-1 mt-6">
            <nav className="-mx-3 space-y-6 ">
               {navigationSections.map((section) => (
                  <div className="space-y-3 " key={section.title}>
                     <label className="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">{section.title}</label>
                     {section.items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                           <div key={item.name}>
                              <a
                                 className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                                 href={item.href}>
                                 <IconComponent className="w-5 h-5" />
                                 <span className="mx-2 text-sm font-medium">{item.name}</span>
                              </a>
                              {item.subItems && (
                                 <div className="ml-6 space-y-2">
                                    {item.subItems.map((subItem) => {
                                       const SubIconComponent = subItem.icon;
                                       return (
                                          <a
                                             key={subItem.name}
                                             className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                                             href={subItem.href}>
                                             <SubIconComponent className="w-5 h-5" />
                                             <span className="mx-2 text-sm font-medium">{subItem.name}</span>
                                          </a>
                                       );
                                    })}
                                 </div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               ))}
            </nav>
         </div>
      </aside>
   );
}
