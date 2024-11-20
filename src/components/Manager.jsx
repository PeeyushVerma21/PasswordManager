import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords()
    }, [])

    const showPassword = () => {
        if (ref.current.src.includes("icons/Hide.png")) {
            ref.current.src = "icons/Show.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "icons/Hide.png"
            passwordRef.current.type = "text"
        }
    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            // If any such id exists in the db, delete it(it is the password which persists after editing)
            await fetch("http://localhost:3000/", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            })
            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: uuidv4() })
            })
            // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
            // console.log([...passwordArray, form]);
            setForm({ site: "", username: "", password: "" })
            toast('Saved Successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error:Password not saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const editPassword = (id) => {
        console.log("Editing password with id", id);
        setForm({...passwordArray.filter(item => item.id === id)[0], id: id})
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id", id);
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id !== id)))
            let res = await fetch("http://localhost:3000/", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            toast('Deleted Successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        toast('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition="Bounce"
            />
            {/* Same as */}
            <ToastContainer />
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]">
                </div>
            </div>
            <div className="p-3 md:mycontainer min-h-[84.5vh]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    Pass
                    <span className='text-green-500'>OP/&gt; </span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>
                <div className="text-black flex flex-col p-4 gap-8 items-center">
                    <input value={form.site} name='site' onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" id='site' />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} name='username' onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" id='username' />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} name='password' onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" id='password' />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src='icons/Show.png' alt='eye' />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit gap-2 border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/sbnjyzil.json"
                            trigger="click"
                            state="hover-swirl"
                            colors="primary:#121331,secondary:#000000">
                        </lord-icon>
                        Save</button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div> No Passwords to show </div>}
                    {passwordArray.length !== 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800  text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='text-center py-2 border border-white'>
                                                <div className='flex items-center justify-center'>
                                                    <a href='item.site' target='_blamk'><span>{item.site}</span></a>
                                                    <div className='lordiconcopy cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/fjvfsqea.json"
                                                            trigger="click"
                                                            state="hover-unfold"
                                                            style={{ "width": "23px", "height": "23px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center py-2 border border-white'>
                                                <div className='flex items-center justify-center'>
                                                    <span>{item.username}</span>
                                                    <div className='lordiconcopy cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/fjvfsqea.json"
                                                            trigger="click"
                                                            state="hover-unfold"
                                                            style={{ "width": "23px", "height": "23px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center py-2 border border-white'>
                                                <div className='flex items-center justify-center'>
                                                    <span>{"*".repeat(item.password.length)}</span>
                                                    <div className='lordiconcopy cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/fjvfsqea.json"
                                                            trigger="click"
                                                            state="hover-unfold"
                                                            style={{ "width": "23px", "height": "23px", "paddingTop": "3px", "paddingLeft": "3px" }}>
                                                        </lord-icon>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-center py-2 border border-white'>
                                                <span className='cursor-pointer mx-1' onClick={() => { { editPassword(item.id) } }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/exymduqj.json"
                                                        trigger="click"
                                                        state="hover-line"
                                                        style={{ "width": "23px", "height": "23px" }}>
                                                    </lord-icon>
                                                </span>
                                                <span className='cursor-pointer mx-1' onClick={() => { { deletePassword(item.id) } }}>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/hwjcdycb.json"
                                                        trigger="click"
                                                        state="morph-trash-in"
                                                        style={{ "width": "23px", "height": "23px" }}>
                                                    </lord-icon>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    )
}

export default Manager
