import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import Lenis from '@studio-freight/lenis'
import {Outlet} from "react-router-dom"
import { useRecoilState, useSetRecoilState } from "recoil";
import { latestArticleAtom, numberOfArticlesAtom, toastMsgAtom } from "../atoms/atoms";
import Footer from "../components/footer";
import { Toast } from "../components/toaster";
import { AdminLoader } from "../components/loader";
import { Goup } from "../components/Goup";
import { SnowEffect } from "../components/snowyeffect";
export function RootLayout({children}){
  
    const [toastMsg, setToastMsg] = useRecoilState(toastMsgAtom)
    const [numberOfArticle, setNumberOfArticle] = useRecoilState(numberOfArticlesAtom)
    const setLatestArticle = useSetRecoilState(latestArticleAtom)
    const [loading, setLoading] = useState(false)
  
    useEffect(() => {
        const getLatestArticle = async () => {
            setLoading(true)
            try {
                let limit = 5
                let offset = Math.max(numberOfArticle - limit, 0)

                if (numberOfArticle == 0) return;
                limit = Math.min(limit, numberOfArticle)

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}get-all-article?limit=${limit}&offset=${offset}`);

                const data = await response.json()
                if(data.statusCode >= 300){
                    setLoading(false)
                    setToastMsg(data.data)
                    return;
                }
                setLatestArticle(data.message)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setToastMsg(error.message || "something went wrong")
                setLoading(false)
                return
            }
        }
        getLatestArticle()
    }, [numberOfArticle])

    useEffect(() => {
        const getNumberOfArticles = async () => {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}get-number-of-article`);  
            const data = await response.json()
            if(data.statusCode >= 300){
                setToastMsg(data.data)
                setLoading(false)
                return;
            }
            setNumberOfArticle(data.message)
            setLoading(false)
        }
        getNumberOfArticles()
    }, [])

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return(<div className="w-screen min-h-screen overflow-hidden">
        {loading && <AdminLoader />}
        <SnowEffect />
        <Goup />
        {toastMsg !== "" &&
            <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        <Navbar />
        <div className="w-full pt-20 pb-10 px-2 sm:px-20">
            <Outlet>{children}</Outlet>
        </div>
        <Footer />
    </div>)
}