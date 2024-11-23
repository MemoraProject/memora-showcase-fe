"use client";
import { QueryClient, QueryClientProvider } from "react-query";
import AiCommunicate from "./components/ai-communicate";
import { useState } from "react";
import Head from "next/head";

export default function HomePage() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AiCommunicate />
      </QueryClientProvider>
    </main>
  );
}
