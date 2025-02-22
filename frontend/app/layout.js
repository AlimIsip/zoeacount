import "./globals.css";
import {isActive, getUser, isRole} from "@/lib/sessiondetails";
import Header from "@/components/layout/NavBar";


export const metadata = {
  title: "ZoeaCount",
  description: "A Next.js application for counting crab larvae.",
};

export default async function RootLayout({ children }) {
  const status = await isActive();
  const user = await getUser();
  const isAdmin = await isRole("admin");
  console.log("the user is", user, isAdmin);

  return (
    <html lang="en">
      <head> 
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-sky-950 text-amber-700 min-h-screen">
        <Header isActive={status} user={user} />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
