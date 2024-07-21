import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser()

  if(!userId){
    return <div> <h1 className='text-center mt-10'>You are not logged in</h1></div>
  }
  
  return (
    <div className="px-4">
      <div className="container flex items-center justify-center mt-8 mx-auto bg-zinc-800 rounded-xl py-10">
        <h1 className='text-center text-white'>Hii, {user?.firstName}</h1>
      </div>
    </div>
  );
}
