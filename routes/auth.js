const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post(
      '/login',
            [
                  check('email')
                        .isEmail()
                        .withMessage('Please enter a valide email!')
                        .normalizeEmail(),
                  body(
                        'password', 
                        'Please enter a password with only numbers and text and at least 5 characters' 
                  )
                  .isLength({min: 5})
                  .isAlphanumeric()
                  .trim()
            ],
      authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post(
      '/signup',
      [
            check('email')
                  .isEmail()
                  .withMessage('Please enter a valide email!')
                  .custom((value, { req }) => {
                        // if (value === 'test@test.com') {
                        //       throw new Error('Please enter a valide email!');
                        // }
                        // return true;
                        return User.findOne({ email: value  })
                        .then(userDoc => {
                              if (userDoc) {
                                    return Promise.reject('Email already exists!');
                              }
                        });
                  })
                  .normalizeEmail(),
            body(
                  'password', 
                  'Please enter a with only numbers and text and at least 5 characters' 
            )
            .isLength({min: 5})
            .isAlphanumeric()
            .trim(),
            body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                  if(value !== req.body.password) {
                        throw new Error('Password have to match');
                  }
                  return true; 
            })
      ],
      authController.postSignup
);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;