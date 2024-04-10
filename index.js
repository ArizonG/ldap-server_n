const express = require('express');
const ActiveDirectory = require('activedirectory2');
const cors = require('cors');

const app = express();
const port = 3000; // You can change this port as needed

// Enable CORS
app.use(cors());

// Configure your Active Directory connection
const adConfig = {
  url: 'ldap://your-ldap-server-url', // Replace with your LDAP server URL
  baseDN: 'dc=example,dc=com', // Replace with your base domain name
  username: 'admin_username', // Replace with your admin username
  password: 'admin_password' // Replace with your admin password
};

const ad = new ActiveDirectory(adConfig);


// Authentication endpoint
app.get('/auth', (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

//   res.json({auth : true})

  ad.authenticate(username, password, (err, auth) => {
    if (err) {
      console.log('Authentication failed:', err);
      res.status(500).send('Authentication failed');
      return;
    }

    if (auth) {
      console.log('Authentication successful');
      res.json({ auth: true });
    } else {
      console.log('Authentication failed');
      res.json({ auth: false });
    }
  });
});

// Fetch users endpoint
app.get('/fetch-users', (req, res) => {

    // res.json([{
    //     firstName : "john",
    //     lastName : "som",
    //     email : "some@gmail.com",
    //     phone : "3456789",
    //     EmpID : 45678
    // },
    // {
    //     firstName : "john2",
    //     lastName : "som2",
    //     email : "some2@gmail.com",
    //     phone : "3456789",
    //     EmpID : 456728
    // }])
  ad.findUsers((err, users) => {
    if (err) {
      console.log('Error fetching users:', err);
      res.status(500).send('Error fetching users');
      return;
    }

    console.log('Users fetched successfully');
    res.json(users);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
