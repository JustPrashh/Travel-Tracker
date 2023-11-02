import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "[Your Password]",
  port: 5432,
};

const db = new pg.Client(dbConfig);

db.connect()
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

async function checkVisited() {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [currentUserId]);
    return result.rows.map((country) => country.country_code);
  } catch (err) {
    handleServerError(err);
  }
}

async function getUsers() {
  try {
    const result = await db.query("SELECT * FROM users");
    const users = result.rows;
    const currentUserColor = users.find((user) => user.id == currentUserId);
    return { users, currentUserColor };
  } catch (err) {
    handleServerError(err);
  }
}

app.get("/", async (req, res) => {
  const countries = await checkVisited();
  const { users, currentUserColor } = await getUsers();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUserColor.color,
  });
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1;", [`%${input.toLowerCase()}%`]);
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)", [countryCode, currentUserId]);
    res.redirect("/");
  } catch (err) {
    handleServerError(err, res);
  }
});

app.post("/user", async (req, res) => {
  if (req.body.add === "new") {
    return res.render("new.ejs");
  } else {
    currentUserId = req.body.user;
    return res.redirect("/");
  }
});

app.post("/new", async (req, res) => {
  const { name, color } = req.body;
  try {
    const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", [name, color]);
    currentUserId = result.rows[0].id;
    return res.redirect('/');
  } catch (err) {
    handleServerError(err, res);
  }
});

function handleServerError(err, res) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
