const models = require('../models');
const bcryptjs = require('bcryptjs');
const Validator = require('fastest-validator');
const jwt = require('jsonwebtoken');

async function login(req, res) {
  try {
    const user = await models.User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      return res.status(404).send({
        message: 'User not found'
      });
    }

    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ id: user.userId }, process.env.JWT_KEY);
    return res.status(200).send({
      message: 'User logged in successfully',
      data: {
        token: token
      }
    });


  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

async function registerUser(req, res) {
  try {
    const isUserExist = await models.User.findOne({
      where: {
        username: req.body.username
      }
    });
    //Exception Handling
    if (isUserExist) {
      return res.status(409).send({
        message: 'User already exists'
      });
    }

    const userData = {
      username: req.body.username,
      password: req.body.password
    };

    //Validating
    const validator = new Validator();
    const validationResponse = await validator.validate(userData, {
      username: { type: 'string', optional: false, max: '20' }, //Max 20 karakter
      password: { type: 'string', optional: false, max: '50' },
    });

    if (validationResponse !== true) {
      return res.status(400).send({
        message: 'Validation failed',
        data: validationResponse
      });
    }

    const hash = await bcryptjs.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hash,
      status: 'default'
    };

    const newUser = await models.User.create(user);

    res.status(201).send({
      message: 'User created successfully',
      data: {
        name: newUser.name,
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

async function registerAdmin(req, res) {
  try {
    const isUserExist = await models.User.findOne({
      where: {
        username: req.body.username
      }
    });
    //Exception Handling
    if (isUserExist) {
      return res.status(409).send({
        message: 'User already exists'
      });
    }

    const userData = {
      username: req.body.username,
      password: req.body.password
    };

    //Validating
    const validator = new Validator();
    const validationResponse = await validator.validate(userData, {
      username: { type: 'string', optional: false, max: '20' }, //Max 20 karakter
      password: { type: 'string', optional: false, max: '50' },
    });

    if (validationResponse !== true) {
      return res.status(400).send({
        message: 'Validation failed',
        data: validationResponse
      });
    }

    const hash = await bcryptjs.hash(req.body.password, 10);
    const user = {
      name: req.body.name,
      password: hash,
      status: 'admin'
    };

    const newUser = await models.User.create(user);

    res.status(201).send({
      message: 'User created successfully',
      data: {
        name: newUser.name,
      }
    });
  } catch (error) {
    res.status(500).send({
      message: error.message
    });
  }
}

module.exports = {
  login,
  registerUser,
  registerAdmin
}