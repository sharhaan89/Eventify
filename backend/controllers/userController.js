import User from "../models/User.js";

export async function handleUserSignup(req, res) {
    const { username, email, password, confirmation, role } = req.body;

    if (password !== confirmation) {
    return res.status(400).send("Passwords do not match.");
    }

    const existingemail = await User.findOne({ email });
    if (existingemail) {
    return res.status(409).send("EMAIL ALREADY EXISTS");
    }

    const existingUser = await Signupdata.findOne({ username });
    if (existingUser) {
    return res.status(409).send("USER NAME ALREADY EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sudata = new Signupdata({
    username,
    email,
    password: hashedPassword,
    role,
    });

    await sudata.save();
    res.status(200).send("SIGN UP CREDENTIALS ADDED TO DB");
}

export async function handleUserLogin(req, res) {
      try {
    const { email, password } = req.body;

    const user = await Signupdata.findOne({ email });
    if (!user) return res.status(404).send("USER NOT FOUND");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Incorrect password.");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Internal server error.");
  }
}

export async function handleGetUserRegistrations(req, res) {
    
}