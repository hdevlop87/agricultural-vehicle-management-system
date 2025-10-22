import React from 'react';
import Image from 'next/image';
import intro from '@/assets/images/ParkingImage.png'
import logo from '@/assets/images/logo.png'
import { Toaster } from '@/components/ui/sonner';
import { ForgotPasswordDialog } from './ForgotPasswordDialog';



const AuthLayout = ({ children }) => {
    return (
        <div className='flex h-full w-full overflow-hidden'>
            <div className='h-full w-1/2 hidden lg:flex'>
                <Image src={intro} alt='noauth' className='w-full h-full' />
            </div>
            <div className='flex flex-col h-full flex-1 justify-center items-center'>
                <Image src={logo} width={120} height={120} alt='noauth' />
                {children}
                <Toaster richColors/>
                <ForgotPasswordDialog />
            </div>
        </div>
    )
}

export default AuthLayout