import "../styles/globals.css";

import { AppProps } from "next/app.js";

import React from "react";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
    return <Component {...pageProps} />;
}
