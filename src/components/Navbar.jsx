import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white'>
            <div className="mycontainer flex justify-between items-center px-4 h-14 py-5">
                <div className="logo font-bold text-2xl">
                    <span className='text-green-500'>&lt;</span>
                     Pass
                     <span className='text-green-500'>OP/&gt; </span>
                     </div>
                <ul>
                </ul>
                <button className='text-white bg-green-700 rounded-md flex justify-between items-center ring-white ring-1'>
                    <img className='invert w-10 p-1' src='icons/github.png' alt='github logo' />
                    <span className='font-bold px-2'>GitHub</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
