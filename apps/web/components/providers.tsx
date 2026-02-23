"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {AppQueryProvider} from "@/lib/query-provider"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppQueryProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </AppQueryProvider>
  )
}