import "./globals.css";
import {isActive, getUser} from "@/lib/sessiondetails";
import Header from "@/components/layout/NavBar";


export const metadata = {
  title: "ZoeaCount",
  description: "A Next.js application for counting crab larvae.",
};

export default async function RootLayout({ children }) {
  const status = await isActive();
  const user = await getUser();
  console.log("the user is", user);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
      <Header isActive={status} user={user}/>
          {children}
      </body>
    </html>
  );
}
