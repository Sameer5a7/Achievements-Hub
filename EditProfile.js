import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUserAlt } from 'react-icons/fa'
import { AiOutlineUpload } from 'react-icons/ai'
import Loader from "../GeneralScreens/Loader";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import '../../Css/EditProfile.css'

const EditProfile = () => {
    const { activeUser, config } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [photo, setPhoto] = useState('')
    const [previousPhoto, setPreviousPhoto] = useState('')
    const [branch, setBranch] = useState('')  // ✅ New branch state
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData()
        formdata.append("username", username)
        formdata.append("email", email)
        formdata.append("photo", photo)
        formdata.append("branch", branch)  // ✅ include branch

        try {
           // const { data } = await axios.post("/user/editProfile", formdata, config)
           await axios.post("/user/editProfile", formdata, config)


            setSuccess('Edit Profile successfully ')
            setTimeout(() => {
                navigate('/profile')
            }, 1500)
        }
        catch (error) {
            setTimeout(() => {
                setError('')
            }, 7000)
            setError(error.response?.data?.error || "Something went wrong")
        }
    }

    useEffect(() => {
        setUsername(activeUser.username)
        setEmail(activeUser.email)
        setPreviousPhoto(activeUser.photo)
        setPhoto(activeUser.photo)
        setBranch(activeUser.branch || "CSE")  // ✅ default if no branch
        setTimeout(() => {
            setLoading(false)
        }, 1050)
    }, [navigate, activeUser])

    return (
        <>
            {
                loading ? <Loader /> :
                    <div className="Inclusive-editprofile-page">
                        <form onSubmit={handleSubmit}>
                            {error && <div className="error_msg">{error}</div>}
                            {success && <div className="success_msg">{success}  </div>}

                            <div className="input-wrapper">
                                <input type="text"
                                    id="username" placeholder="Username"
                                    name='username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="username">Username</label>
                            </div>

                            <div className="input-wrapper">
                                <input type="email"
                                    id="email" placeholder="Email"
                                    name='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email">E-mail</label>
                            </div>

                            {/* ✅ Branch Selection */}
                            <div className="input-wrapper">
                                <select
                                    id="branch"
                                    name="branch"
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                >
                                    <option value="CSE">CSE</option>
                                    <option value="EEE">EEE</option>
                                    <option value="ECE">ECE</option>
                                    <option value="MECH">MECH</option>
                                    <option value="CIVIL">CIVIL</option>
                                </select>
                                <label htmlFor="branch">Branch</label>
                            </div>

                            <div className="profile-ımg-upld-wrapper">
                                <div className="ProfilePhotoField">
                                    <FaUserAlt />
                                    <div className="txt">
                                        {photo === previousPhoto ?
                                            <div>
                                                <AiOutlineUpload />
                                                <span>Change Profile Photo</span>
                                            </div>
                                            : photo.name
                                        }
                                    </div>
                                    <input
                                        name="photo"
                                        type="file"
                                        onChange={(e) => {
                                            setPhoto(e.target.files[0])
                                        }}
                                    />
                                </div>

                                <div className="currentImage">
                                    <div className="absolute">Currently Image</div>
                                    <img src={`http://localhost:5000/userPhotos/${previousPhoto}`} alt="userPhoto" />
                                </div>
                            </div>

                            <button type='submit' className='editprofile-btn'>
                                Edit Profile
                            </button>
                        </form>
                    </div>
            }
        </>
    )
}

export default EditProfile;
