import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("deleted.");
  } catch (err) {
    console.log(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const becomeASeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    // if (!user) {
    //   return next(createError(404, "User not found"));
    // }
    await User.findByIdAndUpdate(
      req.userId,
      {
        isSeller: true,
      },
      { new: true }
    );
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );
    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send("success");
  } catch (err) {
    next(err);
  }
};
