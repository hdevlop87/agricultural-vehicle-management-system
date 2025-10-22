import Icon from "@/components/NIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
   name: string;
   icon: string;
   path?: string;
   onClick?: () => void;
   isExpanded?: boolean
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ name, icon, path, onClick, isExpanded }) => {

   const pathname = usePathname();
   const isActive = path ? pathname === path : false;
   const itemClasses = `flex items-center gap-2 p-2 rounded-lg ${isActive ? 'bg-primary' : 'hover:bg-accent'}`;
   if (path) {
      return (
         <Link href={path} className={itemClasses}> 
            <Icon icon={icon}  className='min-w-6 text-card-foreground'/>
            {isExpanded && <span className='text-sm'>{name}</span>}
         </Link>
      );
   }

   return (
      <div className={`${itemClasses} cursor-pointer`} onClick={onClick}>
         <Icon icon={icon}  className='min-w-6 text-card-foreground'/>
         {isExpanded && <span className='text-sm'>{name}</span>}
      </div>
   );
};