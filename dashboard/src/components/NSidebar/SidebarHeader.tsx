import React from 'react'
import logo from '@/assets/images/logo.png';
import Image from 'next/image';

type HeaderProps = {
   isExpanded: boolean;
}

const SidebarHeader: React.FC<HeaderProps> = () => {
   return (
      <div className='flex justify-center items-center gap-2'>
         <Image src={logo} alt='logo' className='min-w-14 w-15 h-15'/>
      </div>
   )
}

export default SidebarHeader