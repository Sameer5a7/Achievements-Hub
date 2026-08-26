const asyncErrorWrapper = require("express-async-handler");
const User = require("../Models/user");
const Story = require("../Models/story");
const CustomError = require("../Helpers/error/CustomError");
const { comparePassword, validateUserInput } = require("../Helpers/input/inputHelpers");

// 🔹 Get profile
const profile = asyncErrorWrapper(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

// 🔹 Edit profile (update username, email, photo, branch)
const editProfile = asyncErrorWrapper(async (req, res, next) => {
  const { email, username, branch } = req.body; // ✅ include branch

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      email,
      username,
      branch, // ✅ update branch
      photo: req.savedUserPhoto, // may be undefined if no new photo uploaded
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    data: user,
  });
});

// 🔹 Change password
const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const { newPassword, oldPassword } = req.body;

  if (!validateUserInput(newPassword, oldPassword)) {
    return next(new CustomError("Please check your inputs", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!comparePassword(oldPassword, user.password)) {
    return next(new CustomError("Old password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
    user: user,
  });
});

// 🔹 Add/remove story to/from read list
const addStoryToReadList = asyncErrorWrapper(async (req, res, next) => {
  const { slug } = req.params;
  const { activeUser } = req.body;

  const story = await Story.findOne({ slug });
  const user = await User.findById(activeUser._id);

  if (!user.readList.includes(story.id)) {
    user.readList.push(story.id);
  } else {
    const index = user.readList.indexOf(story.id);
    user.readList.splice(index, 1);
  }

  user.readListLength = user.readList.length;
  await user.save();

  const status = user.readList.includes(story.id);

  return res.status(200).json({
    success: true,
    story: story,
    user: user,
    status: status,
  });
});

// 🔹 Get user read list
const readListPage = asyncErrorWrapper(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const readList = [];

  for (let index = 0; index < user.readList.length; index++) {
    const story = await Story.findById(user.readList[index]).populate("author");
    readList.push(story);
  }

  return res.status(200).json({
    success: true,
    data: readList,
  });
});

module.exports = {
  profile,
  editProfile,
  changePassword,
  addStoryToReadList,
  readListPage,
};
