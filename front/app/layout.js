import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";
import ImportBsJS from "./library/bootstrapJS";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Library Management Application",
  description: "Borrow, return, check all book's library in one click !",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ImportBsJS />
      <body className={inter.className}>
        <nav className="navbar navbar-expand-md bg-light">
          <div className="container-fluid">
            <Link href={"/"} className="navbar-brand">
              <Image src="/ezlib.png" width={150} height={50} alt="EzLib logo" />
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse ms-5" id="navbarTogglerDemo02">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <div className="dropdown">
                    <a className="nav-link active dropdown-toggle" aria-current="page" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                      Books
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/books" className="dropdown-item">
                          See all books
                        </Link>
                      </li>
                      <li>
                        <Link href="/books/add" className="dropdown-item">
                          Add book
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <div className="dropdown">
                  <a className="nav-link active dropdown-toggle ms-2" aria-current="page" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                    Users
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/users" className="dropdown-item">
                        See all users
                      </Link>
                    </li>
                    <li>
                      <Link href="/users/add" className="dropdown-item">
                        Add user
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <a className="nav-link active dropdown-toggle ms-2" aria-current="page" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                    Borrowings
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link href="/borrowings" className="dropdown-item">
                        See all borrowings
                      </Link>
                    </li>
                    <li>
                      <Link href="/borrowings/add" className="dropdown-item">
                        Add borrowing
                      </Link>
                    </li>
                  </ul>
                </div>
              </ul>
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </nav>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </body>
    </html>
  );
}
