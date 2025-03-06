const asyncHandler = require("../middleware/async");
const Student = require("../models/student");
const path = require("path");
const fs = require("fs");
const student = require("../models/student");

exports.getusers = asyncHandler(async (req, res, next) => {
  const users = await Student.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

exports.getStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res
      .status(404)
      .json({ message: "Student not found with id of ${req.params.id}" });
  } else {
    res.status(200).json({
      success: true,
      data: student,
    });
  }
});

exports.register = asyncHandler(async (req, res, next) => {
  const student = await Student.findOne({ username: req.body.username });
  console.log(req.body);
  if (student) {
    return res.status(400).send({ message: "Student already exists" });
  }
  await Student.create(req.body);

  res.status(200).json({
    success: true,
    message: "Student created successfully",
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  const student = await Student.findOne({ username }).select("+password");

  if (!student || !(await student.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(student, 200, res);
});

exports.searchBybatch = asyncHandler(async (req, res, next) => {
  const batchId = req.params.batchId;

  Student.find({ batch: batchId })
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .select("-password -__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of users by batch",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

exports.searchByCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;

  Student.find({
    course: {
      $elemMatch: {
        $eq: { _id: courseId },
      },
    },
  })
    .select("-password -__v")
    .populate("batch", "-__v")
    .populate("course", "-__v")
    .then((student) => {
      res.status(201).json({
        success: true,
        message: "List of users by course",
        data: student,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err,
      });
    });
});

exports.updateStudent = asyncHandler(async (req, res, next) => {
  const user = req.body;
  const student = await Student.findByIdAndUpdate(req.params.id, user, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return res.status(404).send({ message: "Student not found" });
  }

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.user.id).select("-password");
  res.status(200).json(student);
});

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  console.log(req.params.id);
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      if (student != null) {
        var imagePath = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          student.image
        );

        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log(err);
          }
          res.status(200).json({
            success: true,
            message: "Student deleted successfully",
          });
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Student not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    });
});

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
});

const sendTokenResponse = (Student, statusCode, res) => {
  const token = Student.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options) 
    .json({
      success: true,
      token,
    });
};
