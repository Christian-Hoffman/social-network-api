const User = require("../models/User");

module.exports = {
  getAllUsers(req, res) {
    User.find()
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  },
  getUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then((data) =>
        !data
          ? res
              .status(404)
              .json({ message: "There is no user associated with this id" })
          : res.json(data)
      )
      .catch((err) => res.status(500).json(err));
  },
  createUser(req, res) {
    User.create(req.body)
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findByIdAndUpdate({ _id: req.params.userId }, req.body, {
      runValidators: true,
      new: true,
    })
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.userId)
      .then((userData) => res.json(userData))
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((data) =>
        !data
          ? res
              .status(404)
              .json({ message: " There is no user associated with this id" })
          : res.json(data)
      )
      .catch((err) => res.status(500).json(err));
  },
  deleteFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((data) =>
        !data
          ? res
              .status(404)
              .json({ message: " There is no user associated with this id" })
          : res.json(data)
      )
      .catch((err) => res.status(500).json(err));
  },
};
