import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex items-center justify-center flex-col gap-10">
            <h1 className="text-2xl font-semibold mt-10">Sign-pp Page</h1>
            <SignUp />
        </div>
    )
}