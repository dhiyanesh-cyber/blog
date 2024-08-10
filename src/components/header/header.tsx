'use client'

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SearchBar from "../searchBar";
import { useSearch } from "../../context/SearchContext";
import {  usePathname } from "next/navigation";
import "./header.css";



export default function Header() {

    const params = usePathname();


    const { setSearchTerm } = useSearch();
    return (
        <div className="bg-zinc-900 font-sans text-neutral-100 px-3">
            <div className="container mx-auto flex items-center justify-between py-4 h-20">
                <Link className="font-bold nunito" href='/'>Blogzpot</Link>
                {params === "/" &&
                    <div className="hidden sm:block">
                        <SearchBar width="w-96" bg="bg-zinc-800" onSearch={setSearchTerm} />
                    </div>
                }

                <div>
                    <div className="flex gap-5" >
                        <SignedOut>
                            <Link href='/sign-in' className="whitespace-nowrap">Sign In</Link>
                        </SignedOut>

                        <div className="container flex justify-center items-center gap-7">
                            <SignedIn>
                                <Link href='/my-blogs'>
                                    <button
                                        className="align-middle select-none nunito font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1.5 px-3 rounded-md bg-gradient-to-tr from-white to-neutral-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
                                        type="button">
                                        MY BLOGS
                                    </button>
                                </Link>
                                <UserButton />
                            </SignedIn>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}