import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimeLogo } from '../components/animelogo';

import { useNavigate } from "react-router-dom"

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toastMsg, setToastmsg] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({email, password}),
            })
    

            if (!response.ok) {
                setToastmsg("wrong credentials")
            }


            if (response.status > 300) {
                setToastmsg("wrong credentials")
            }

            else{
                const data = await response.json()
                localStorage.setItem("token", "Bearer " + data?.message)
                navigate("/admin")
            } 

        } catch (error) {
            setToastmsg(error)
            console.error('Error:', error)
        }
   

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-desc py-12 px-4 sm:px-6 lg:px-8">
           
            <motion.div
                className="max-w-md w-full space-y-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center">
                    <motion.div
                        className="mx-auto h-12 w-12"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimeLogo />
                    </motion.div>
                    <h2 className="mt-6 text-3xl font-extrabold text-primary">Qiwi Animes</h2>
                    <p className="mt-2 text-sm text-desc">
                        Admin{' '}
                        <a href="#" className="font-medium text-accent hover:text-opacity-80">
                            sign in only
                        </a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none text-dark relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="text-dark appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-text rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-accent hover:text-opacity-80">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <motion.button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-dark bg-primary hover:bg-opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign in
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

