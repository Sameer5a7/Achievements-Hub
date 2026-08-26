import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import Loader from '../GeneralScreens/Loader';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';
import '../../Css/EditStory.css';

const EditStory = () => {
    const { config } = useContext(AuthContext)
    const slug = useParams().slug
    const imageEl = useRef(null)
    const pdfEl = useRef(null)
    const [loading, setLoading] = useState(true)
    //const [story, setStory] = useState({})
    const [image, setImage] = useState('')
    const [previousImage, setPreviousImage] = useState('')
    const [pdf, setPdf] = useState('')
    const [previousPdf, setPreviousPdf] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
   const getStoryInfo = async () => {
       setLoading(true)
       try {
           const { data } = await axios.get(`/story/editStory/${slug}`, config)
           setTitle(data.data.title)
           setContent(data.data.content)
           setImage(data.data.image)
           setPreviousImage(data.data.image)
           if (data.data.pdfFile) {
               setPdf(data.data.pdfFile)
               setPreviousPdf(data.data.pdfFile)
           }
           setLoading(false)
       } catch (error) {
           navigate("/")
       }
   }
   getStoryInfo()
}, [slug, config, navigate])   // ✅ added deps


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formdata = new FormData()
        formdata.append("title", title)
        formdata.append("content", content)
        formdata.append("previousImage", previousImage)
        if (image && image !== previousImage) formdata.append("image", image)
        if (pdf && pdf !== previousPdf) formdata.append("pdfFile", pdf)

        try {
            await axios.put(`/story/${slug}/edit`, formdata, config)
            setSuccess('Story updated successfully')
            setTimeout(() => {
                navigate('/')
            }, 2500)
        }
        catch (error) {
            setError(error.response?.data?.error || "Something went wrong")
            setTimeout(() => setError(''), 4500)
        }
    }

    return (
        <>
            {
                loading ? <Loader /> : (
                    <div className="Inclusive-editStory-page">
                        <form onSubmit={handleSubmit} className="editStory-form">

                            {error && <div className="error_msg">{error}</div>}
                            {success && (
                                <div className="success_msg">
                                    <span>{success}</span>
                                    <Link to="/">Go home</Link>
                                </div>
                            )}

                            <input
                                type="text"
                                required
                                id="title"
                                placeholder="Title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                            />

                            <CKEditor
                                editor={ClassicEditor}
                                onChange={(e, editor) => setContent(editor.getData())}
                                data={content}
                            />

                            <div className="currentlyImage">
                                <div className="absolute">Current Image</div>
                                <img src={`http://localhost:5000/storyImages/${previousImage}`} alt="storyImage" />
                            </div>

                            <div className="StoryImageField">
                                <AiOutlineUpload />
                                <div className="txt">
                                    {image === previousImage ? "Change the image in your story" : image.name}
                                </div>
                                <input
                                    name="image"
                                    type="file"
                                    ref={imageEl}
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>

                            {previousPdf && (
                                <div className="currentlyPdf">
                                    <div className="absolute">Current PDF</div>
                                    <a
                                        href={`http://localhost:5000/storyPdfs/${previousPdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {previousPdf}
                                    </a>
                                </div>
                            )}

                            <div className="StoryPdfField">
                                <AiOutlineUpload />
                                <div className="txt">
                                    {pdf && pdf !== previousPdf
                                        ? pdf.name
                                        : "Attach a new PDF (optional)"}
                                </div>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={pdfEl}
                                    onChange={(e) => setPdf(e.target.files[0])}
                                />
                            </div>

                            <button type='submit' className='editStory-btn'>
                                Edit Story
                            </button>
                        </form>
                    </div>
                )
            }
        </>
    )
}

export default EditStory;
