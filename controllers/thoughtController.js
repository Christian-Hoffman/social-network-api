const { Thought, User } = require('../models');

module.exports = {
  getAllThoughts(req, res) {
    Thought.find()
    .select('-__v')
    .then(
      (data) => res.json(data))
    .catch((err) => res.status(500).json(err));
  },
  getThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
    .select('-__v')
    .then(
      (data) => !data ? res.status(404).json({ message: 'There is no thought associated with this id'}) : res.json(data))
    .catch((err) => res.status(500).json(err));
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((data) => {
        return User.findOneAndUpdate({ username: req.body.username }, { $addToSet: { thoughts: data._id }},{ runValidators: true, new: true });
      })
      .then((data) => !data ? res.status(404).json({ message: 'Thought was created but there is no user associated with the given id'}) : res.json('Thought created'))
      .catch((err) => {
        res.status(500).json(err);
      });
  },
}