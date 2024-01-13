"use client"

import Link from "next/link"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import logo from "./logo.png"
import Image from "next/image"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const links = [
    {
      title: "Whatsapp",
      href: "/whatsapp"
    },
    {
      title: "Redirect",
      href: "/redirect"
    },
    {
      title: "Funil",
      href: "/funil"
    },
    {
      title: "Integrações",
      href: "/i"
    }
  ]

  const pathname = usePathname()

  return (
    <div className="flex tracking-wider">
      <aside className="w-96 bg-gradient-to-r from-green-700 to-green-500 h-screen p-8">
        <Image src={logo} width={200} height={100} alt="logo" />
        <nav className="flex flex-col text-2xl gap-1 uppercase text-white mt-5">
          {links.map((link, index) => (
            <Link key={index} href={link.href} className={clsx(pathname.startsWith(link.href) && "font-light")}>
              {link.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="w-full bg-gray-100 h-screen p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
