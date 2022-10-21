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
  updateThought(req, res) {
    Thought.findByIdAndUpdate({ _id: req.params.thoughtId }, req.body, { runValidators: true, new: true })
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json(err));
  },
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((data) => !data ? res.status(404).json({ message: 'There is no thought associated with the given id'}) : User.findOneAndUpdate({ thoughts: { _id: req.params.thoughtId }},{ $pull: { thoughts: { _id: req.params.thoughtId }}},{ runValidators: true, new: true }))
      .then((data) => !data ? res.status(404).json({ message: ' Thought deleted but there is no user associated with the given id'}) : res.json({ message: 'Thought deleted'}))
      .catch((err) => res.status(500).json(err));
  },
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId },{ $addToSet: { reactions: req.body }},{ runValidators: true, new: true })
      .then((data) => !data ? res.status(404).json({ message: 'There is no thought associated with the given id'}) : res.json(data))
      .catch((err) => res.status(500).json(err));
  },
  deleteReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId },{ $pull: { reactions: { _id: req.params.reactionId }}},{ runValidators: true, new: true })
      .then((data) => !data ? res.status(404).json({ message: 'There is no thought associated with the given id'}) : res.json(data))
      .catch((err) => res.status(500).json(err));
  },
};