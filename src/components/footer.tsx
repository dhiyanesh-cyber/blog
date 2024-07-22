import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="bg-zinc-900 text-neutral-100 px-3">
            <div className="container  mx-auto flex items-center justify-center py-4 ">
                <h2 className="text-center">Footer</h2>
            </div>
        </div>
    )
}
