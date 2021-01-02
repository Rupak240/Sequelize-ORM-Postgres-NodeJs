const express = require("express");
const { sequelize, user, Post } = require("./models");

const app = express();

app.use(express.json());

// Create a User - POST
app.post("/users", async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await require("./models").user.create({ name, email, role });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Get all users - GET
app.get("/users", async (req, res) => {
  try {
    const users = await require("./models").user.findAll({ include: "posts" });

    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Get a single user by uuid - GET
app.get("/users/:uuid", async (req, res) => {
  const id = req.params.uuid;
  try {
    const user = await require("./models").user.findOne({
      where: { uuid: id },
      include: "posts",
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Delete a single user - DELETE
app.delete("/users/:uuid", async (req, res) => {
  const id = req.params.uuid;
  try {
    const user = await require("./models").user.findOne({
      where: { uuid: id },
    });

    await user.destroy();

    return res.json({ msg: "User deleted." });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Update a single user info - DELETE
app.put("/users/:uuid", async (req, res) => {
  const id = req.params.uuid;
  const { name, email, role } = req.body;
  try {
    const user = await require("./models").user.findOne({
      where: { uuid: id },
    });

    user.name = name;
    user.email = email;
    user.role = role;

    await user.save();

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Create a post by a user - POST
app.post("/post", async (req, res) => {
  const { userUuid, body } = req.body;
  try {
    const user = await require("./models").user.findOne({
      where: { uuid: userUuid },
    });

    const post = await Post.create({ body, userId: user.id });

    console.log(post);
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

// Fetch all posts - GET
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({ include: ["user"] });

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}.`);
  await sequelize.authenticate();
  console.log("Database Connected.");
});

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Database Connected.");
//     app.listen(PORT, console.log(`Server is running on port ${PORT}.`));
//   })
//   .catch((error) => console.log(error));
