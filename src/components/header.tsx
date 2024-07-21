import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
    return (
        <div className="bg-zinc-900 text-neutral-100 px-3">
            <div className="container mx-auto flex items-center justify-between py-4 ">
                <Link href='/'>Home</Link>
                <div>
                    <div className="flex gap-5">


                        <SignedOut>
                            <Link href='/sign-in'>Sign In</Link>
                        </SignedOut>

                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </div>
    )
}
