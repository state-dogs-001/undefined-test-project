const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------------------------------ import auth model ------------------------------------------ //
const userTemplate = require("../models/userModel");
const tokenTemplate = require("../models/tokenModel");

// ---------------------------------------- import products model ---------------------------------------- //
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

// Get user from token_col in database
router.get("/get-user", async (request, response) => {
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

// create product
router.post("/add-product", (request, response) => {
  // If not has token or token is invalid can't create product.
  const token = request.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret");
    // if decode success can create product
    if (decoded) {
      const mobile = new mobileTemplate({
        product_brand: request.body.product_brand,
        product_name: request.body.product_name,
        product_img: request.body.product_img,
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
    }
  } catch (error) {
    response.json({ status: "tokenError", error: error });
  }
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
  // If not has token or token is invalid can't update product.
  const token = request.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret");
    // if decode success can create product
    if (decoded) {
      const id = request.body.id;
      const update = request.body;
      const options = { new: true };

      try {
        const data = await mobileTemplate.findByIdAndUpdate(
          id,
          update,
          options
        );
        response.json({
          status: "ok",
          message: "Update product success",
          data: data,
        });
      } catch (error) {
        response.json({
          status: "error",
          error: error,
          message: "Update product fail",
        });
      }
    }
  } catch (error) {
    response.json({ status: "tokenError", error: error });
  }
});

// Delete products
router.delete("/delete-product", async (request, response) => {
  // If not has token or token is invalid can't delete product.
  const token = request.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, "secret");
    // if decode success can create product
    if (decoded) {
      const id = request.body.id;
      try {
        //Find product by id once before delete it.
        const isProduct = await mobileTemplate.findById(id);
        // Found and delete it
        if (isProduct) {
          await mobileTemplate.findByIdAndDelete(id);
          response.json({ status: "ok", message: "Delete product success." });
        }
        // Not found product.
        else {
          response.json({
            status: "error",
            message: "Can't delete, product not found.",
          });
        }
      } catch (error) {
        response.json({
          status: "error",
          message: "Error, delete fail.",
        });
      }
    }
  } catch (error) {
    response.json({ status: "tokenError", error: error });
  }
});

// ---------------------------------------- Router for CRUD products --------------------------------------- //

module.exports = router;
