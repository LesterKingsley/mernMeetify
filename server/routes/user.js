const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const postParser = bodyParser.urlencoded({ extended: true });
const User = require("../models/User");
const tokenValidator = require("../middlewares/tokenValidator");
const Apmt = require("../models/Apmt");
const { json } = require("body-parser");
const { findOne } = require("../models/User");
const multer = require("multer");
const path = require("path");
const Photo = require("../models/Photo");
const fs = require("fs");
const { apmtValidator } = require("../validators");
// for images sake
const UPLOAD_PATH = path.resolve(__dirname, "path/to/uploadedProfiles");
const upload = multer({
  dest: UPLOAD_PATH,
  limits: { fileSize: 1000000, files: 5 },
});
// getting the profile pic

router.get("/profile/image/:id", (req, res) => {
  Photo.findOne({ _id: req.params.id }, (err, image) => {
    if (err) return res.sendStatus(404);
    fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res);
  });
});

// uploading profile pic
router.post(
  "/profile/imageUpload",
  upload.array("image", 5),
  tokenValidator,
  async (req, res, next) => {
    const images = await req.files.map((file) => {
      return {
        filename: file.filename,
        originalname: file.originalname,
      };
    });

    Photo.insertMany(images, async (err, result) => {
      if (err) return res.sendStatus(404);

      const setProfile = await User.findOneAndUpdate(
        { _id: req.user },
        { $set: { profilePic: result[0]._id } }
      );

      res.status(200).json(result);
    });
  }
);
//fetch User detaiils
router.get("/fetchUser", postParser, tokenValidator, async (req, res) => {
  try {
    const fetchData = await User.findById(req.user);
    res.status(200).json(fetchData);
  } catch (err) {
    res.status(500).json({ msg: err.response });
  }
});
//update user info for Address,Number,and Bio

router.post("/updateUser", postParser, tokenValidator, async (req, res) => {
  try {
    console.log(req.body);
    const { number, address, bio, job } = req.body;
    const fetchData = await User.findByIdAndUpdate(req.user, {
      $set: { number: number, address: address, bio: bio, job: job },
    });
    res.status(200).json(fetchData);
  } catch (err) {
    res.status(500).json({ msg: err.response });
  }
});
//for viewing users so it wont fetch all infos
router.get("/viewUser/:email", postParser, tokenValidator, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const checkRel = await User.findOne({ email: req.params.email });
    const fetchData = await User.findOne({ email: req.params.email }).select(
      "-password -requests"
    );

    let connectionStatus =
      user.email == req.params.email
        ? "self"
        : checkRel.connections.some((id) => id == req.user) == true
        ? "connected"
        : checkRel.requests.some((id) => id == req.user) == true
        ? "pending"
        : "connect";
    console.log(user.email === req.params.email);
    console.log(connectionStatus);
    res.status(200).json({ fetchData, connectionStatus });
  } catch (err) {
    res.status(500).json({ msg: err.response });
  }
});

//testing jwt authentication
router.get("/protect", tokenValidator, async (req, res) => {
  try {
    const user = await User.findById(req.user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/createApmt", tokenValidator, postParser, async (req, res) => {
  try {
    const { name, participants, descript, dateOfMeeting } = req.body;
    const myEmail = await User.findById(req.user);

    const { error } = await apmtValidator(req.body);
    if (error) return res.status(402).json({ msg: error.details[0].message });

    const uniqueParticipants = Array.from(
      new Set([...participants, myEmail.email])
    );

    //email ng participants tapos kukuhanin ung id nila saka yun ilalagay sa objectId sa array saka ipapapulate
    const emailToId = async (par) => {
      let idArray = [];
      for (const p of par) {
        let data = await User.findOne({ email: p });
        if (!data)
          return res.status(404).json({ msg: `${p} is not a valid user` });
        idArray.push(data._id);
      }
      return Array.from(new Set(idArray));
    };

    let jack = await emailToId(uniqueParticipants);

    const newAppointment = new Apmt({
      createdBy: req.user,
      participants: jack,
      name,
      descript,
      dateOfMeeting,
    });

    await newAppointment.save();
    res.status(200).json({ newAppointment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// //more detailed than myApmt ( if the apmt is clicked)
// router.get("/showApmt/:id", tokenValidator, async (req, res) => {
//   try {
//     const apmt = await Apmt.findById(req.params.id)
//       .populate("createdBy", "username email")
//       .populate("participants", "username email");
//     res.status(200).json({ apmt });
//     console.log(apmt);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// });

//total appointments
router.get("/myTotalApmt", tokenValidator, async (req, res) => {
  try {
    const apmt = await Apmt.find({ participants: { _id: req.user } });
    return res.status(200).json(apmt.length);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//total appontment of others when visiting
//total appointments
router.get("/userTotalApmt/:id", tokenValidator, async (req, res) => {
  try {
    const apmt = await Apmt.find({ participants: { _id: req.params.id } });
    return res.status(200).json(apmt.length);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//show your current appointments
router.get("/myApmt", tokenValidator, async (req, res) => {
  try {
    const apmt = await Apmt.find(
      { participants: { _id: req.user } },
      "_id name descript dateCreated dateOfMeeting createdBy participants rejected approved"
    )
      .populate("createdBy", "username email")
      .populate("participants", "username email");

    return res.status(200).json(apmt);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//RESPOND TO APPOINTMENT
router.post(
  "/attendAppointment/:id/:response",
  tokenValidator,
  async (req, res) => {
    try {
      const apmt = await Apmt.findById(req.params.id);

      if (req.params.response == "true") {
        if (apmt.approved.some((id) => id == req.user) === true) {
          return res.status(402).json({ msg: "you already approved" });
        }
        const apmtUpdate = await Apmt.findByIdAndUpdate(req.params.id, {
          $push: { approved: req.user },
          $pull: { rejected: req.user },
        });
      } else {
        if (apmt.rejected.some((id) => id == req.user) === true) {
          return res.status(402).json({ msg: "you already rejected" });
        }
        const apmtUpdate = await Apmt.findByIdAndUpdate(req.params.id, {
          $pull: { approved: req.user },
          $push: { rejected: req.user },
        });
      }
      res.status(200).json({ msg: "succesfully responded" });
      return res.status(200).json(apmt);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  }
);
//TASKS

//SEARCH PEOPLE FOR ADDING CONNECTIONS
router.get("/searchUsers/:key", tokenValidator, async (req, res) => {
  try {
    const key = await new RegExp(req.params.key, "ig");
    const findUserByEmail = await User.find({ email: key })
      .select("email username")
      .limit(5);
    const findUserByUsername = await User.find({ username: key })
      .select("email username")
      .limit(5);
    const allResults = await findUserByEmail.concat(findUserByUsername);
    const filteredResults = await Array.from(
      allResults.reduce((a, o) => a.set(o.email, o), new Map()).values()
    );
    res.status(200).json(findUserByEmail);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
// TO SEARCH THROUGH CONNECTIONS  FOR ADDING IN APPOINTMENTS (CLICK IN FRONTEND THE RESULTS)
router.get("/searchConnections/:key", tokenValidator, async (req, res) => {
  try {
    const key = await new RegExp(req.params.key, "ig");
    const findUserByEmail = await User.find({
      email: key,
      connections: [req.user],
    });
    const findUserByUsername = await User.find({ username: key }).limit(5);
    const allResults = await findUserByEmail.concat(findUserByUsername);
    const filteredResults = await Array.from(
      allResults.reduce((a, o) => a.set(o.email, o), new Map()).values()
    ).select("email");
    res.status(200).json(filteredResults);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//MY CONNECTIONS
router.get("/myConnections", tokenValidator, async (req, res) => {
  try {
    const connectionemails = await User.findById(req.user)
      .select("connections")
      .populate("connections", "email username profilePic");

    res.status(200).json(connectionemails.connections);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//LIKE REACT EMOJIS IN FACEBOOK
//TO REJECT APMTS
router.post("rejectApmt/:id", tokenValidator, async (req, res) => {
  try {
    const whenApprovedFirst = await Apmt.findByIdAndUpdate(req.params.id, {
      $pull: { approved: req.user },
    });
    const rejectThen = await Apmt.findByIdAndUpdate(req.params.id, {
      $push: { rejected: req.user },
    });
    res.status(200).json({ msg: "successfully approved" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//TO APPROVE APMTS
router.post("rejectApmt/:id", tokenValidator, async (req, res) => {
  try {
    const whenRejectedFirst = await Apmt.findByIdAndUpdate(req.params.id, {
      $pull: { rejected: req.user },
    });
    const approvedThen = await Apmt.findByIdAndUpdate(req.params.id, {
      $push: { approved: req.user },
    });
    res.status(200).json({ msg: "successfully approved" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//CONNECTIONS

//REQUEST A CONNECTION
router.post("/requestConnection/:email", tokenValidator, async (req, res) => {
  try {
    const requestedUser = await User.findOne({ email: req.params.email });
    if (requestedUser.requests.some((id) => id == req.user) === true) {
      return res.status(402).json({ msg: "you already send a request" });
    }

    console.log(requestedUser.requests.some((id) => id === req.user));
    const updateUser = await User.findByIdAndUpdate(requestedUser._id, {
      $push: { requests: req.user },
    });
    res.status(200).json({ updateUser });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//SHOW REQUESTS
router.get("/showMyRequests", tokenValidator, async (req, res) => {
  try {
    const userRequests = await User.findOne(
      { _id: req.user },
      "requests"
    ).populate("requests", "email username profilePic");
    res.status(200).json(userRequests.requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//TO REJECT REQUEST OR TO REMOVE IN CONNECTIONS IN ONE ROUTE
router.post("/rejectConnection/:id", tokenValidator, async (req, res) => {
  try {
    //gagawa pa ng if statement kung nagpapaadd talaga sa kanya ung user
    //remove a person in requests

    //pwedeng gantong update para makita kung na modified na sa .rest
    // const removeRequest = await User.update(
    //   { _id: req.user },
    //   {
    //     $pull: { requests: req.params.id },
    //   }
    // );
    //remove from the current user
    console.log(req.params.id);
    const removeRequestA = await User.findByIdAndUpdate(req.user, {
      $pull: { requests: req.params.id },
    });
    const removeConnectionA = await User.findByIdAndUpdate(req.user, {
      $pull: { connections: req.params.id },
    });
    //remove from the party of current user
    const removeRequestB = await User.findByIdAndUpdate(req.params.id, {
      $pull: { requests: req.user },
    });
    const removeConnection = await User.findByIdAndUpdate(req.params.id, {
      $pull: { connections: req.user },
    });

    res.status(200).json({ msg: "successfully removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});
//ACCEPT A REQUEST SO BASICALLY PUSH TO CONNECTION
router.post("/acceptRequest/:id", tokenValidator, async (req, res) => {
  try {
    //check if the user really request to this user
    const checkRequest = await User.findById(req.user);
    if (checkRequest.requests.some((id) => id == req.params.id) == false)
      return res.status(404).json({ msg: "user not found" });
    //remove  in request
    const removeRequest = await User.findByIdAndUpdate(req.user, {
      $pull: { requests: req.params.id },
    });
    //approve request then add to connections of the user
    const approveRequest = await User.findByIdAndUpdate(req.user, {
      $push: { connections: req.params.id },
    });
    //add to connections from the user who request
    const updateRequest = await User.findByIdAndUpdate(req.params.id, {
      $push: { connections: req.user },
    });
    res.status(200).json({ msg: "connection successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.delete("/deleteApmt/:id", tokenValidator, async (req, res) => {
  try {
    const apmt = await Apmt.findById(req.params.id);
    if (!apmt) res.status(404).json({ msg: "apmt not found" });
    if (apmt.createdBy != req.user)
      return res.status(403).json({ msg: "action unathorized" });

    const deleteApmt = await Apmt.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
