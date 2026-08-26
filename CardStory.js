import React from 'react';
import { Link } from 'react-router-dom';

const Story = ({ story }) => {

    const editDate = (createdAt) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const d = new Date(createdAt);
        return `${d.getDate()} ${monthNames[d.getMonth()]}, ${d.getFullYear()}`;
    };

    const truncateContent = (content) => {
        return content.length > 73 ? content.substr(0, 73) + "..." : content;
    };

    const truncateTitle = (title) => {
        return title.length > 69 ? title.substr(0, 69) + "..." : title;
    };

    // ✅ FIX: Correct image path for old & new posts
    const storyImage = story.image?.startsWith("/storyImages") || story.image?.startsWith("http")
        ? story.image
        : `/storyImages/${story.image || "default.jpg"}`;

    return (
        <div className="story-card">
            <Link to={`/story/${story.slug}`} className="story-link">
                <img
                    className="story-image"
                    src={storyImage}
                    alt={story.title}
                />

                <div className="story-content-wrapper">
                    <h5 className="story-title">
                        {truncateTitle(story.title)}
                    </h5>

                    <p
                        className="story-text"
                        dangerouslySetInnerHTML={{ __html: truncateContent(story.content) }}
                    ></p>

                    {/* ✅ Show Author + Branch + Date */}
                    <p className="story-createdAt">
                        By <strong>{story.author?.username}</strong>
                        {story.author?.branch && (
                            <span className="story-branch"> ({story.author.branch})</span>
                        )}
                        &nbsp; | {editDate(story.createdAt)}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default Story;
