import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ClientWalletProvider } from "@/components/contexts/ClientWalletProvider";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientWalletProvider>
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </ClientWalletProvider>
  );
}