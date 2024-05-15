import "../styles/globals.css";
import { AppProps } from "next/app.js";
import React from "react";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    const bgUrl = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE;
    return (
        <div className="max-w-screen max-h-screen">
            {bgUrl && (
                <div className="w-screen h-screen bg-cover" style={{ backgroundImage: `url("${bgUrl}")` }}>
                    <div className="w-full h-full" style={{ backgroundColor: `rgba(0, 0, 0, ${Number(process.env.NEXT_PUBLIC_BACKGROUND_DARKEN ?? 0) / 100})` }} />
                </div>
            )}
            <div className="absolute top-0 left-0">
                <Component {...pageProps} />
            </div>
        </div>
    )
}
