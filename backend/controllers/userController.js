import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function handleGetCurrentUser(req, res) {
  try {
    const id = req.user.id;

    const user = await User.findById(id).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function handleUserSignup(req, res) {
  const { username, email, password, organization, role, gender, branch, yog } = req.body;

  // List of allowed branches
  const allowedBranches = ['CSE', 'MECH', 'CHEM', 'CIVIL', 'ECE', 'EEE', 'IT', 'MACS', 'META', 'MINING', 'PHY'];

  // Check for missing or empty values
  if (!username || !email || !password || !organization || !role || !gender || !branch || !yog) {
    return res.status(400).json({ error: "All fields are required and must not be empty." });
  }

  // Optional: Validate branch
  if (!allowedBranches.includes(branch)) {
    return res.status(400).json({ error: "Invalid branch provided." });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "EMAIL ALREADY EXISTS" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "USER NAME ALREADY EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      organization,
      role,
      gender,
      branch,
      yog
    });

    await newUser.save();
    res.status(200).json({ msg: "SIGN UP CREDENTIALS ADDED TO DB" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({error: "USER NOT FOUND"});

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({error: "Incorrect password."});

    const token = jwt.sign(
      { id: user._id, role: user.role, organization: user.organization },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send JWT as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,    
      secure: true,
      sameSite: "none",    
      maxAge: 60 * 60 * 1000 * 24
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({error: "Internal server error."});
  }
}

export async function handleUserLogout(req, res) {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      //secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout Error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
}
