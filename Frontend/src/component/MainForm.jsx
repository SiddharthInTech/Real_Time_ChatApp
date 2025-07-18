import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MainForm = () => {

    const navigate = useNavigate();

    const [error, seterror] = useState("")
    const [style, setstyle] = useState(false)
    const [data, setdata] = useState({ name: "", room: "" })

    const handleChange = (e) => {
        setdata({
            ...data, [e.target.name]: e.target.value
        })
    }



    const validation = () => {
        if (!data.name) {
            seterror("Please enter your name");
            return false;
        }
        if (!data.room) {
            seterror("Please enter your room");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validation();
        if (isValid) {
            navigate(`/chat/${data.room}`, { state: data })
        }
    }



    return (
        <div style={{ backgroundColor: "#2d2b2b" }} className='px-3 py-4 shadow text-dark border rounded row'>
            <form onSubmit={handleSubmit}>
                <div className='form-group mb-4'>
                    <h2 className='text-warning mb-4'>Welcome to Chatclub</h2>
                </div>
                <div className='form-group mb-4'>
                    <input type="text" className='form-control bg-light' name='name' onChange={handleChange} placeholder='Enter name' />
                </div>
                <div className='form-group mb-4'>
                    <select className='form-select bg-light mb-4' name="room" onChange={handleChange}>
                        <option value="">Select Room</option>
                        <option value="gaming">Gaming </option>
                        <option value="coding">Coding </option>
                        <option value="socialmedia">Social Media</option>
                    </select>
                    <button style={{
                        transform: style && "scale(1.03)"
                    }} onMouseEnter={() => setstyle(true)} onMouseLeave={() => setstyle(false)} type='Submit' className='btn btn-warning w-100 mb-2'>Submit</button>

                </div>

                {error ? <small className='text-danger'>{error}</small> : ""}
            </form>

        </div>
    )
}

export default MainForm
