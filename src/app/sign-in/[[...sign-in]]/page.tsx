import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center flex-col gap-10 min-h-svh justify-start mt-20">
            <SignIn />
        </div>
    );
}