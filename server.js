const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/amazon_clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

// Schema for users
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Save email API
app.post("/save-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        await User.create({ email });
        res.json({ message: "Email saved successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving email" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
