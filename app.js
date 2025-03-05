const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes= require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
      User.findById("67c891cc6bb5453107cae83d")
      .then(user => {
            req.user =  user;
            next();
      })
      .catch(err => {
            console.log(err);
      });
});

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://scofieldmykiel:Testing1@nodejs-complete.p76ua.mongodb.net/shop?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true')
.then(result => {
      User.findOne().then(user => {
            if(!user) {
                  const user = new User({
                        name: 'Mykiel',
                        email: 'scofield@test.com',
                        cart: {
                              items: []
                        }
                  });
                  user.save();
            }
      });
      app.listen(3000);
}).catch(err => {
      console.log(err);
});