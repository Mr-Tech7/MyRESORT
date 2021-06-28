console.log('This is me vaibhav Singh');
const bodyParser = require("body-parser");
const express = require("express");
const nodemailer = require("nodemailer");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/bookingDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const path = require("path");

// FUNCTION FOR AUTHENTICATION
// initializePassport(passport, email => Register.find((user) => user.email === email))


var staticPath = path.join(__dirname, "../views");

const app = express();


// app.set('view-engine', 'ejs')
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// PORT ON WHICH SERVER RUNS
const port = 80;

// Creating Booking Id
var randomNumbers = "RR100";
for (let i = 0; i <= 4; i++) {
  randomNumbers += Math.floor(Math.random() * 10);
}

let bookingId = randomNumbers;
// console.log(randomNumbers)

// DEFINE SCHEMA
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  guests: String,
  date: String,
  phone: String,
  address: String,
  message: String,
  bookingId: String,
});

const dateSchema = new mongoose.Schema({
  date: String,
});

// const registerSchema = new mongoose.Schema({
//   email: String,
//   pass: String,
//   name: String,
// });

// MONGOOSE MODELS
const booking = mongoose.model("booking", bookingSchema); // For Storing all the Data
const Savedate = mongoose.model("date", dateSchema); // For Storing all the dates


app.get("/", (req, res) => {
  res.sendFile(staticPath + "/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(staticPath + "/about.html");
});

app.get("/services", (req, res) => {
  res.sendFile(staticPath + "/services.html");
});

app.get("/book", (req, res) => {
  res.sendFile(staticPath + "/booking.html");
});

app.get('/sendingEmail', (req,res) => {
  res.sendFile(staticPath + '/SendingEmail.html')
})

app.post("/book", (req, res) => {
  const bookingData = req.body;
  console.log(bookingId);
  bookingData.bookingId = bookingId;
  let email  = req.body.email;
  console.log(email)
  const myData = new booking(bookingData);
  const Dates = new Savedate(req.body);
  // SENDING MAIL TO THE USER
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "singhvaibhav7710@gmail.com",
      pass: "GandivDhari@Arjun",
    },
  });

  let name = bookingData.name;
  // WHOM TO SEND AND WHAT TO SEND
  console.log(req.body.email);
  let mailOptions = {
    from: "singhvaibhav7710@gmail.com",
    to: `${req.body.email}`,
    subject: "Booking Confirmation Mail",
    html: `<div style = 'color: gray; background-color: black; display: block; width: 80%; margin: 32px auto; padding: 22px 44px; border-radius: 15px;'><h2 style = 'color: white; font-size: 3rem'>Thank You For Booking ${name}<h2> And This is your booking Id ${bookingId}</div>`,
  };


  // WHAT TO CONSOLE WHEN MAIL SENT AND WHAT WHEN NOT
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });

  // SAVING DATES
  Dates.save()
    .then(() => {
      console.log("dates has been saves");
    })
    .catch(() => {
      console.log("Dates cannot be saved");
    });
  myData.save().then(() => {
    res.redirect("/sendingEmail")
    // console.log("This data has submitted successfully in database");
  });
});

app.get("/check", (req, res) => {
  res.sendFile(staticPath + "/checkBookings.html");
});

app.get("/check/:id", (req, res) => {
  booking.find({ bookingId: req.params.id }).then((result) => {
    let newResult = result[0];
    console.log(result);
    res.send({
      name: newResult.name,
      phone: newResult.phone,
      DateOnWhichHallBOOKED: newResult.date,
    });
  });
});

app.post('/resend', (req, res) => {
  let email = req.body.email;
  if(email == null){
    console.log("Kya kar raha hai")
  }else{
  console.log(email)

let transporter2 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'singhVaibhav7710@gmail.com',
    pass: "GandivDhari@Arjun"
  }
})

let mailOptions2 = {
  from: 'singhVaibhav7710@gmail.com',
  to: `${email}`,
  subject: 'Booking Confirmation Email',
  html: `<h1 style = 'color: cyan'>Thank You for booking Vaibhav Singh. This is Your bookingId ${bookingId}</h1>`
}

transporter2.sendMail(mailOptions2, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email Sent: " + info.response);
  }
})

  res.redirect("/sendingEmail")
        
    }
})

app.listen(port, () => {
  console.log(`This application is running on port ${port}`);
});
