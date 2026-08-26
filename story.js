const asyncErrorWrapper = require("express-async-handler");
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const fs = require("fs");
const path = require("path");
const { searchHelper, paginateHelper } = require("../Helpers/query/queryHelpers");

// 🔹 Helper: delete old PDF file
const deletePdfFile = (pdfUrl) => {
  if (!pdfUrl) return;

  const filename = path.basename(pdfUrl);
  const pdfPath = path.join(__dirname, "..", "public", "storyFiles", filename);

  if (fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }
};

// 🔹 Add a story
const addStory = asyncErrorWrapper(async (req, res, next) => {
  const { title, content } = req.body;
  const wordCount = content.trim().split(/\s+/).length;
  const readtime = Math.floor(wordCount / 200);

  try {
    const imageUrl = req.savedStoryImage
      ? `${req.protocol}://${req.get("host")}/storyImages/${req.savedStoryImage}`
      : `${req.protocol}://${req.get("host")}/storyImages/default.jpg`;

    const pdfUrl = req.savedStoryPdf
      ? `${req.protocol}://${req.get("host")}/storyFiles/${req.savedStoryPdf}`
      : null;

    const newStory = await Story.create({
      title,
      content,
      author: req.user._id,
      image: imageUrl,
      pdf: pdfUrl,
      readtime,
    });

    await newStory.populate("author", "username branch");

    return res.status(200).json({
      success: true,
      message: "Story added successfully",
      data: newStory,
    });
  } catch (error) {
    deleteImageFile(req);
    if (req.savedStoryPdf)
      deletePdfFile(
        `${req.protocol}://${req.get("host")}/storyFiles/${req.savedStoryPdf}`
      );
    return next(error);
  }
});

// 🔹 Get all stories (with correct author branch filter)
const getAllStories = asyncErrorWrapper(async (req, res, next) => {
  const { branch } = req.query; // ?branch=CSE, ?branch=EEE, ?branch=All

  // Base query
  let query = Story.find();

  // Apply search
  query = searchHelper("title", query, req);

  // Pagination
  const paginationResult = await paginateHelper(Story, query, req);
  query = paginationResult.query;

  // Populate author and filter by branch
  let stories = await query
    .sort("-likeCount -commentCount -createdAt")
    .populate("author", "username branch");

  // Filter in-memory only if branch is specified and not "ALL"
  if (branch && branch.toUpperCase() !== "ALL") {
    stories = stories.filter(
      (story) =>
        story.author &&
        story.author.branch &&
        story.author.branch.toUpperCase() === branch.toUpperCase()
    );
  }

  return res.status(200).json({
    success: true,
    count: stories.length,
    data: stories,
    page: paginationResult.page,
    pages: paginationResult.pages,
  });
});

// 🔹 Get story detail
const detailStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const story = await Story.findOne({ slug })
    .populate("author", "username branch")
    .populate("likes");

  const storyLikeUserIds = story.likes.map((u) => u.id);
  const likeStatus = storyLikeUserIds.includes(activeUser._id);

  return res.status(200).json({
    success: true,
    data: story,
    likeStatus,
  });
});

// 🔹 Like/unlike story
const likeStory = asyncErrorWrapper(async (req, res, next) => {
  const { activeUser } = req.body;
  const { slug } = req.params;

  const story = await Story.findOne({ slug })
    .populate("author", "username branch")
    .populate("likes");

  const storyLikeUserIds = story.likes.map((u) => u._id.toString());

  if (!storyLikeUserIds.includes(activeUser._id)) {
    story.likes.push(activeUser);
  } else {
    const index = storyLikeUserIds.indexOf(activeUser._id);
    story.likes.splice(index, 1);
  }

  story.likeCount = story.likes.length;
  await story.save();

  return res.status(200).json({
    success: true,
    data: story,
  });
});

// 🔹 Edit story page
const editStoryPage = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const story = await Story.findOne({ slug })
    .populate("author", "username branch")
    .populate("likes");

  return res.status(200).json({
    success: true,
    data: story,
  });
});

// 🔹 Edit story
const editStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { title, content } = req.body;

  const story = await Story.findOne({ slug });

  story.title = title || story.title;
  story.content = content || story.content;

  // Update image
  if (req.savedStoryImage) {
    deleteImageFile(req, story.image);
    story.image = `${req.protocol}://${req.get("host")}/storyImages/${req.savedStoryImage}`;
  }

  // Update PDF
  if (req.savedStoryPdf) {
    deletePdfFile(story.pdf);
    story.pdf = `${req.protocol}://${req.get("host")}/storyFiles/${req.savedStoryPdf}`;
  }

  await story.save();
  await story.populate("author", "username branch");

  return res.status(200).json({
    success: true,
    data: story,
  });
});

// 🔹 Delete story
const deleteStory = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const story = await Story.findOne({ slug });

  deleteImageFile(req, story.image);
  if (story.pdf) deletePdfFile(story.pdf);

  await story.remove();

  return res.status(200).json({
    success: true,
    message: "Story deleted successfully",
  });
});

module.exports = {
  addStory,
  getAllStories,
  detailStory,
  likeStory,
  editStoryPage,
  editStory,
  deleteStory,
};
