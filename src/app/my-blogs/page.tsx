import Link from 'next/link'
import React from 'react'

export default function MyBlog() {
    return (
        <div className='container flex justify-center items-center pt-10 mx-auto'>
            <Link href='/create-blog'>
                <button
                    className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-neutral-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    type="button"
                >Create Blog</button>
            </Link>
        </div>
    )
}
