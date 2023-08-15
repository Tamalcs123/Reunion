const Post = require("../models/Post");
const User = require("../models/User");

module.exports.createPost_post = async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const post = await Post.create({ title, description });
    const user = await User.findById(userId);

    await user.updateOne({ $push: { posts: post.id } });

    res
      .status(200)
      .json({
        postId: post.id,
        title,
        description,
        createdTime: post.createdAt,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.deletePost_del = async (req, res) => {
  const currUser = req.body.userId;
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(currUser);
    if (user.posts.includes(post.id)) {
      await post.deleteOne();
      await user.updateOne({ $pull: { posts: post.id } });
      res.status(200).json("The Post has been Deleted!");
    } else {
      res.status(403).json("you can delete Only Your Posts");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.likePost_post = async (req, res) => {
  const currUser = req.body.userId;

  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(currUser)) {
      await post.updateOne({ $push: { likes: currUser } });
      res.status(200).json(`You have Liked the Post with Id ${req.params.id}`);
    } else {
      res.status(403).json("You have Already Liked this Post!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.unlikePost_post = async (req, res) => {
  const currUser = req.body.userId;

  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(currUser)) {
      await post.updateOne({ $pull: { likes: currUser } });
      res
        .status(200)
        .json(`You have unLiked the Post with Id ${req.params.id}`);
    } else {
      res.status(403).json("You have not liked this Post!");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.commentPost_post = async (req, res) => {
  const currUser = req.body.userId;
  const comment = req.body.comment;
  try {
    const post = await Post.findById(req.params.id);
    const newComment =  post.comments.push({
      comment,
      userId: currUser,
    });
    await post.save();
    res.status(200).json({ commentId: post.comments[newComment - 1].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.showPost_get = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { title, description } = post;
    res.status(200).json({
      title,
      description,
      likes: post.likes.length,
      comments: post.comments.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.allPosts_get = async (req, res) => {
  let postArray = [];
  const currUser = req.body.userId;
  try {
    const user = await User.findById(currUser);
    for (let id of user.posts) {
      let post = await Post.findById(id);
      if (post) {
        postArray.push({
          id: post.id,
          title: post.title,
          desc: post.description,
          created_at: post.createdAt,
          comments: post.comments,
          likes: post.likes.length,
        });
      }
    }
    res.status(200).json(postArray);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
