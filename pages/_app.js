/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'


function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl">Floating-Cargo</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-indigo-500">
              Home
            </a>
          </Link>
          
          <Link href="/my-nfts">
            <a className="mr-6 text-indigo-500">
              My Documents
            </a>
          </Link>
          <Link href="/create-document">
            <a className="mr-6 text-indigo-500">
              Issue
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-indigo-500">
              Dashboard
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp