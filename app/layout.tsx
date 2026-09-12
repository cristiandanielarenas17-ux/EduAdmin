import "./globals.css";
import { Sidebar } from "@/components/sidebar";

export const metadata = {
  title: "EduAdmin",
  description: "Administración de liceos y escuelas"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen lg:flex">
          <Sidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}