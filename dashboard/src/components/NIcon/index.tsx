import React from 'react'
import { ICONS } from './icons'
import { Icon as IconifyIcon } from '@iconify/react'

export type IconComponentProps = {
  size?: string | number,
  icon: React.ComponentType<any> | string,
  color?: string,
  className?: string,
  strokeWidth?: number,
  stroke?: string,
  fill?: string,
  onClick?: any
   style?: any,
}

const NIcon = ({icon = 'dashboard',size = '24', onClick,...rest}: IconComponentProps) => {

  if (icon && typeof icon === 'object' || typeof icon === 'function') {
    const IconComponent = icon;
    return <IconComponent size={size} onClick={onClick} {...rest} />;
  }
  
  if (typeof icon === 'string') {
    if (ICONS[icon]) {
      const IconComponent = ICONS[icon]
      return (
        <IconComponent
          width={size}
          height={size}
          onClick={onClick}
          {...rest}
        />
      )
    }
    
    return <IconifyIcon 
      icon={icon} 
      width={size} 
      height={size}
      onClick={onClick}
      {...rest} 
    />
  }
  
  return null;
}

export default NIcon