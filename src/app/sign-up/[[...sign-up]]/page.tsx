import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center flex-col gap-10 min-h-svh justify-start ">
            <h1 className="text-2xl font-semibold mt-10">Sign-up Page</h1>
            <SignUp />
        </div>
    )
}