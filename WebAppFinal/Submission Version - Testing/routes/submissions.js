const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { submissionSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const fetch = require("node-fetch");

const ExpressError = require("../utils/ExpressError");
const Submission = require("../models/submission");
const { response } = require("express");

const validateSubmission = (req, res, next) => {
  console.log(req.body);
  const { error } = submissionSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const submissions = await Submission.find({});
    res.render("submissions/index", { submissions });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("submissions/new");
});

router.get("/about", (req, res) => {
  res.render("submissions/about");
});

// router.route("/").post(upload.single("image"), (req, res) => {
//   console.log(req.body, req.file);
//   res.send("IT WORKED!!!");
// });

router.post(
  "/",
  isLoggedIn,
  //validatesubmission,
  upload.single("image"),
  catchAsync(async (req, res, next) => {
    console.log(req.file.path);
    //req.files.map(f => ({url: f.path, filename:f.filename}))

    const submission = new Submission(req.body.submission);
    submission.image = {
      url: req.file.path,
      filename: req.file.filename,
    };

    const url = req.file.path;
    data = { img_url: url };
    data = JSON.stringify(data);
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    };
    const apiend = "http://127.0.0.1:5000/recognize";

    const desc = await getJSON(apiend, data, headers);
    console.log(
      "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    );
    //console.log(desc["latex"]);
    submission.description = desc["latex"];
    submission.author = req.user._id;
    await submission.save();
    console.log(submission);
    req.flash("success", "Successfully made a new submission!");
    res.redirect(`/submissions/${submission._id}`);
  })
);

router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Submission.findById(id);
    if (!camp.author.equals(req.user._id)) {
      req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THAT");
      return res.redirect(`/submissions`);
    }
    // const submission = await submission.findById(req.params.id)
    //   .populate("reviews")
    //   .populate("author");
    const submission = await Submission.findById(req.params.id).populate(
      "author"
    );
    console.log(submission);
    if (!submission) {
      req.flash("error", "Cannot find that submission!");
      return res.redirect("/submissions");
    }
    res.render("submissions/show", { submission });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      req.flash("error", "Cannot find that submission!");
      return res.redirect("/submissions");
    }
    if (!submission.author.equals(req.user._id)) {
      req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THAT");
      return res.redirect(`/submissions`);
    }
    res.render("submissions/edit", { submission });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateSubmission,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission.author.equals(req.user._id)) {
      req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THAT");
      return res.redirect(`/submissions`);
    }
    const camp = await Submission.findByIdAndUpdate(id, {
      ...req.body.submission,
    });
    req.flash("success", "Successfully updated submission!");
    res.redirect(`/submissions/${submission._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Submission.findById(id);
    if (!camp.author.equals(req.user._id)) {
      req.flash("error", "YOU DO NOT HAVE PERMISSION TO DO THAT");
      return res.redirect(`/submissions`);
    }

    //await cloudinary.uploader.destroy(req.file.filename);
    //console.log(req.image.filename);

    // console.log(camp.image.filename);
    await cloudinary.uploader.destroy(camp.image.filename);
    await Submission.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted submission");
    res.redirect("/submissions");
  })
);

async function getJSON(apiend, data, headers) {
  return fetch(apiend, {
    method: "POST",
    body: data,
    headers: headers,
  }).then((response) => {
    return response.json();
  });
}

module.exports = router;
