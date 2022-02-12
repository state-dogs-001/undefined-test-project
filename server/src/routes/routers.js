const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import auth model
const userTemplate = require("../models/userModel");
const tokenTemplate = require("../models/tokenModel");

// import products model
const mobileTemplate = require("../models/mobileModel");

// -------------------------------------------- Router for auth -------------------------------------------- //

// Create user this router not use in frontend.
router.post("/sign-up", (request, response) => {
  // Encryp password with bcrypt
  var salt = bcrypt.genSaltSync(10);
  const genPassword = bcrypt.hashSync(request.body.password, salt);

  const signup = new userTemplate({
    email: request.body.email,
    password: genPassword,
  });

  signup
    .save()
    .then((data) => {
      response.json({ status: "ok", data: data });
    })
    .catch(() => {
      response.json({ status: "error", error: "Duplicate email" });
    });
});

// Sign-in
router.post("/sign-in", (request, response) => {
  const user = new userTemplate({
    email: request.body.email,
    password: request.body.password,
  });

  userTemplate
    .findOne({
      email: user.email,
    })
    .then((findUser) => {
      if (!findUser) {
        response.json({
          status: "error",
          message: "Error, this account does not exit.",
        });
      } else {
        // Check password is match
        const isPassword = bcrypt.compareSync(user.password, findUser.password);

        // if password match
        if (isPassword) {
          // Check token in databse
          tokenTemplate.findOne({ email: user.email }).then((data) => {
            // If has token in database don't create token
            if (data) {
              try {
                const decoded = jwt.verify(data.token, "secret");
                const email = decoded.email;
                // token is ok
                if (email === data.email) {
                  response.json({ status: "ok", user: data });
                }
              } catch (error) {
                // if token out
                response.json({
                  status: "tokenError",
                  message: "Token expire time out.",
                  user: data,
                });
              }
            }
            // If not has any token
            else {
              // Generate new token and save it in database
              const createToken = jwt.sign(
                {
                  email: user.email,
                },
                "secret",
                { expiresIn: "1d" } // Token expire out in 1 day
              );
              const token = new tokenTemplate({
                email: user.email,
                token: createToken,
              });

              token.save().then((data) => {
                response.json({ status: "ok", user: data });
              });
            }
          });
        }

        // if password not match
        else {
          return response.json({
            status: "error",
            user: false,
            message: "Error, invalid password try to check.",
          });
        }
      }
    });
});

// Check state auth
router.get("/check-token", async (request, response) => {
  const token = request.headers["x-access-token"];
  // find this token in database
  tokenTemplate.findOne({ token: token }).then((data) => {
    // has token
    if (data) {
      try {
        const decoded = jwt.verify(data.token, "secret");
        const email = decoded.email;
        // token is ok
        if (email === data.email) {
          response.json({ status: "ok", user: data });
        }
      } catch (error) {
        // token out
        response.json({
          status: "tokenError",
          message: "Token expire time out.",
          user: data,
        });
      }
    }
    // not has token
    else {
      response.json({ status: "error", error: "Not has token" });
    }
  });
});

// Update token when tokenError
router.patch("/update-token", async (request, response) => {
  const id = request.body.id;
  const email = request.body.email;
  const options = { new: true };

  // Create token
  try {
    const newToken = jwt.sign(
      {
        email: email,
      },
      "secret",
      { expiresIn: "1d" } // Token expire out in 1 day
    );
    const res = await tokenTemplate.findByIdAndUpdate(
      id,
      { token: newToken },
      options
    );
    response.json({ status: "ok", user: res });
  } catch (error) {
    response.json(error);
  }
});

// Logout
router.delete("/logout", async (request, response) => {
  const id = request.body.id;
  try {
    await tokenTemplate.findByIdAndDelete(id);
    response.json({ status: "ok", message: "Logout success" });
  } catch (error) {
    response.json({ status: "error", message: "Logout fail" });
  }
});

// -------------------------------------------- Router for auth -------------------------------------------- //

// ---------------------------------------- Router for CRUD products --------------------------------------- //

// Add products
router.post("/add-product", (request, response) => {
  const mobile = new mobileTemplate({
    product_brand: request.body.product_brand,
    product_name: request.body.product_name,
    product_price: request.body.product_price,
    product_description: request.body.product_description,
  });

  mobile
    .save()
    .then((data) => {
      response.json({
        status: "ok",
        data: data,
        message: "Add product success",
      });
    })
    .catch((error) => {
      response.json({
        status: "error",
        error: error,
        message: "Add product fail",
      });
    });
});

// Show products
router.get("/products", async (request, response) => {
  try {
    const mobiles = await mobileTemplate.find();
    response.json({ status: "ok", data: mobiles });
  } catch (error) {
    response.json({
      status: "error",
      error: error,
      message: "Fail to load data.",
    });
  }
});

// Update products
router.patch("/update-product", async (request, response) => {
  const id = request.body.id;
  const update = request.body;
  const options = { new: true };

  try {
    await mobileTemplate.findByIdAndUpdate(id, update, options);
    response.json({
      status: "ok",
      message: "Update product success",
    });
  } catch (error) {
    response.json({
      status: "error",
      error: error,
      message: "Update product fail",
    });
  }
});

// Delete products
router.delete("/delete-product", async (request, response) => {
  const id = request.body.id;
  try {
    await mobileTemplate.findByIdAndDelete(id);
    response.json({ status: "ok", message: "Delete product success" });
  } catch (error) {
    response.json({ status: "error", message: "Error, delete product fail" });
  }
});

// ---------------------------------------- Router for CRUD products --------------------------------------- //

module.exports = router;
