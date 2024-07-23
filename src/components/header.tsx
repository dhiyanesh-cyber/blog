import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <div className="bg-zinc-900 text-neutral-100 px-3">
            <div className="container mx-auto flex items-center justify-between py-4 ">
                <Link href='/'>Blogzpot</Link>
                <div>
                    <div className="flex gap-5" >
                        <SignedOut>
                            <Link href='/sign-in' className="whitespace-nowrap">Sign In</Link>
                        </SignedOut>

                        <div className="container flex justify-center items-center gap-7">
                            <SignedIn>
                                <Link href='/my-blogs'>
                                    <button
                                        className="align-middle select-none font-sans font-normal text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1.5 px-3 rounded-md bg-gradient-to-tr from-white to-neutral-400 text-black shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
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
