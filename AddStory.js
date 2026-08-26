import React, { useRef, useContext, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../../Context/AuthContext";
import { AiOutlineUpload } from 'react-icons/ai';
import { FiArrowLeft } from 'react-icons/fi';
import '../../Css/AddStory.css';

const AddStory = () => {
  const { config } = useContext(AuthContext);
  const imageEl = useRef(null);
  const pdfEl = useRef(null);
  const editorEl = useRef(null);

  const [image, setImage] = useState('');
  const [pdf, setPdf] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [branch, setBranch] = useState("CSE");
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const clearInputs = () => {
    setTitle('');
    setContent('');
    setImage('');
    setPdf('');
    setBranch("CSE");
    if (editorEl.current) editorEl.current.editor.setData('');
    if (imageEl.current) imageEl.current.value = "";
    if (pdfEl.current) pdfEl.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("content", content);
    formdata.append("branch", branch); // ✅ branch sent to backend
    if (image) formdata.append("image", image); // ✅ matches backend
    if (pdf) formdata.append("pdf", pdf);       // ✅ matches backend field 'pdf'

    try {
      await axios.post("/story/addstory", formdata, config);

      setSuccess('Story added successfully');
      clearInputs();
      setTimeout(() => setSuccess(''), 7000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
      setTimeout(() => setError(''), 7000);
    }
  };

  return (
    <div className="Inclusive-addStory-page">
      <Link to='/'>
        <FiArrowLeft />
      </Link>
      <form onSubmit={handleSubmit} className="addStory-form">
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          id="branch"
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
        >
          <option value="CSE">CSE</option>
          <option value="EEE">EEE</option>
          <option value="ECE">ECE</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
        </select>

        <CKEditor
          editor={ClassicEditor}
          onChange={(e, editor) => setContent(editor.getData())}
          ref={editorEl}
        />

        <div className="StoryImageField">
          <AiOutlineUpload />
          <div className="txt">
            {image ? image.name : "Include a high-quality image in your story to make it more inviting to readers."}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={imageEl}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="StoryPdfField">
          <AiOutlineUpload />
          <div className="txt">
            {pdf ? pdf.name : "Attach a PDF if your story has additional material."}
          </div>
          <input
            type="file"
            accept="application/pdf"
            ref={pdfEl}
            onChange={(e) => setPdf(e.target.files[0])}
          />
        </div>

        <button
          type='submit'
          disabled={!title || !content}
          className={(title && content) ? 'addStory-btn' : 'dis-btn'}
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default AddStory;
