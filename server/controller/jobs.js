const Job = require("../models/Job");

exports.createJob = (req, res) => {
  const {
    companyName,
    description,
    location,
    salary,
    techstack,
    lastDate,
    startDate,
    experience
  } = req.body;
  const user = req.user;

  if (
    !companyName ||
    !description ||
    !location ||
    !salary ||
    !techstack ||
    !lastDate ||
    !startDate ||
    !experience
  ) {
    return res.json({ error: "Please add all fields" });
  }

  // let techStackArray = new Array();
  const techStackArray = techstack.split(",");
  // console.log(techStackArray);

  const job = new Job({
    companyName,
    description,
    location,
    salary,
    lastDate,
    startDate,
    experience,
    techstack: techStackArray,
    createdBy: user,
  });

  // console.log(internship);

  job
    .save()
    .then((job) => {
      res.json({ message: "Saved Succcessfully" });
    })
    .catch((err) => {
      console.log(err);
      return res.json({ error: "Something Went Wrong" });
    });
};

exports.getAllJobs = (req, res) => {
  Job.find()
    .populate("createdBy", "_id personName")
    .sort("-createdAt")
    .then((jobs) => {
      res.json({jobs: jobs});
    })
    .catch((err) => {
      return res.json({ error: "Something Went Wrong" });
    });
};

exports.updateJob = (req, res) => {
  const {
    postId,
    description,
    location,
    stipend,
    techstack,
    duration,
    lastDate,
    startDate,
    experience,
  } = req.body;

  Job.findById(postId)
    .then((job) => {
      // console.log(job);
      if (description) {
        job.description = description;
      }
      if (location) {
        job.location = location;
      }
      if (stipend) {
        job.stipend = stipend;
      }
      if (techstack) {
        const techStackArray = techstack.split(",");
        job.techstack = techStackArray;
      }
      if (duration) {
        job.duration = duration;
      }
      if (lastDate) {
        job.lastDate = lastDate;
      }
      if (startDate) {
        job.startDate = startDate;
      }
      if (experience) {
        job.experience = experience;
      }

      job
        .save()
        .then((intern) => {
          res.json({ message: "Internship updated sucessfully!" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: "Something went wrong!" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong!" });
    });
};

exports.searchFilterJobs = async(req, res) => {
  const match = {}
  if(req.query.location){
    match.location = req.query.location 
  }
  if(req.query.experience){
    match.experience = req.query.experience 
  }
  if(req.query.companyName){
    match.companyName = req.query.companyName 
  }
  if(req.query.techstack){
    match.techstack = { $in: req.query.techstack }
  }
  if(req.query.startDate){
    date = new Date(req.query.startDate).toISOString()
    match.startDate = date
  }
  const jobs = await Job.find(match)
  try{
    res.status(200).send({ jobs: jobs });
  }
  catch(e){
    return res.status(400).send('something went wrong')
  }
  // const internship = await Internship.find({ techstack: { $in: match.techstack }, 'location': 'l2'})

}