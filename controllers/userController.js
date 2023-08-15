const User = require("../models/User");

module.exports.currentUser_get = async (req, res) => {
  try {
    const user = await User.findOne({email:req.body.email});

    if (!user) {
      return res.status(404).json("User not found");
    }

    res
      .status(200)
      .json({
        username: user.username,
        followers: user.followers.length,
        followings: user.followings.length,
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.followUser_post = async (req, res) => {
  const {currId} = req.body;
  if (currId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(currId);

      if (!user.followers.includes(currId)) {
        await user.updateOne({ $push: { followers: currId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });

        res
          .status(200)
          .json(`You are now Following user with Id ${req.params.id}`);
      } else {
        // currUser already follows user
        res.status(403).json("You Already follow this User.");
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(403).json("You cannot Follow Yourself!");
  }
};

module.exports.unfollowUser_post = async (req, res) => {
  const {currId} = req.body;
  if (currId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(currId);

      if (user.followers.includes(currId)) {
        await user.updateOne({ $pull: { followers: currId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });

        res
          .status(200)
          .json(`You are now Unfollowing user with Id ${req.params.id}`);
      } else {
        // currUser already unfollows user
        res.status(403).json("Not following the user yet.");
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(403).json("You cannot UnFollow Yourself!");
  }
};
