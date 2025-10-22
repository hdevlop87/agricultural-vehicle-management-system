// components/Register.jsx
'use client'

import { Mail, Lock, User } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useRegister } from '@/hooks/useRegister'
import NForm from '@/components/NForm'
import FormInput from '@/components/NForm/FormInput'
import RegisterButton from '@/components/NButtons/RegisterButton'
import React from 'react'
import Link from 'next/link'


const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

const Register = () => {
    const { register, isLoading } = useRegister();

    const defaultValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const handleRegister = async (userData) => {
        await register(userData);
    }

    return (
        <div className='flex flex-col text-black justify-center items-center pb-20 pr-16 pl-16  w-full md:w-[500px]'>
            <span className='text-3xl mb-2 text-black [text-shadow:_-1px_-1px_0_white,_1px_-1px_0_white,_-1px_1px_0_white,_1px_1px_0_white]'>Create an account</span>
            <div className='flex flex-col h-full w-full gap-1 text-black'>

                <NForm id='register-form' schema={registerSchema} defaultValues={defaultValues} onSubmit={handleRegister}>
                    <FormInput
                        name='name'
                        type='text'
                        formLabel='Full Name'
                        placeholder='Enter your full name'
                        variant='default'
                        icon={User}
                        iconColor='black'
                        className='bg-white hover:border-black'
                    />

                    <FormInput
                        name='email'
                        type='text'
                        formLabel='Email'
                        placeholder='Enter your email'
                        variant='default'
                        icon={Mail}
                        iconColor='black'
                        className='bg-white hover:border-black'
                    />

                    <FormInput
                        name='password'
                        type='password'
                        formLabel='Password'
                        placeholder='Create a password'
                        variant='default'
                        icon={Lock}
                        iconColor='black'
                        className='bg-white hover:border-black'
                    />

                    <FormInput
                        name='confirmPassword'
                        type='password'
                        formLabel='Confirm Password'
                        placeholder='Confirm your password'
                        variant='default'
                        icon={Lock}
                        iconColor='black'
                        className='bg-white hover:border-black'
                    />
                </NForm>

                <RegisterButton
                    form='register-form'
                    className='bg-black text-white hover:bg-secondary cursor-pointer'
                    loading={isLoading}
                />

                <Label className='mt-2 flex w-full  text-center'>
                    Already have an account? <Link href="/login" className='text-white hover:underline ml-1'>Log In</Link>
                </Label>
            </div>
        </div>
    )
}

export default Register