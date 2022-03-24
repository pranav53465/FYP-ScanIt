const Submission = require("../models/submission");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const submissions = await Submission.find({});
  res.render("submissions/index", { submissions });
};

module.exports.renderNewForm = (req, res) => {
  res.render("submissions/new");
};

module.exports.createSubmission = async (req, res, next) => {
  const submission = new Submission(req.body.submission);
  submission.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  submission.author = req.user._id;
  await submission.save();
  console.log(submission);
  req.flash("success", "Successfully made a new submission!");
  res.redirect(`/submissions/${submission._id}`);
};

module.exports.showSubmission = async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!submission) {
    req.flash("error", "Cannot find that submission!");
    return res.redirect("/submissions");
  }
  res.render("submissions/show", { submission });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const submission = await Submission.findById(id);
  if (!submission) {
    req.flash("error", "Cannot find that submission!");
    return res.redirect("/submissions");
  }
  res.render("submissions/edit", { submission });
};

module.exports.updateSubmission = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const submission = await Submission.findByIdAndUpdate(id, {
    ...req.body.submission,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  submission.images.push(...imgs);
  await submission.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await submission.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated submission!");
  res.redirect(`/submissions/${submission._id}`);
};

module.exports.deleteSubmission = async (req, res) => {
  const { id } = req.params;
  await Submission.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted submission");
  res.redirect("/submissions");
};
