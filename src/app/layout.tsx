import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { DebtProvider } from "@/contexts/debt-context"
import { NavBar } from "@/components/nav-bar"

export const metadata = {
  title: "Till Debt Do Us Part",
  description: "Track and manage your debt journey",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DebtProvider>
            <NavBar />
            {children}
          </DebtProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
