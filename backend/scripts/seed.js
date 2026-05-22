/**
 * Seeds the database with two sample users and a handful of tasks.
 *
 * Run from the backend directory:
 *   npm run seed
 *
 * The script is idempotent: existing users are detected by email and skipped,
 * and tasks belonging to the sample users are wiped before reseeding.
 */
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

dotenv.config();

const SAMPLE_USERS = [
  {
    name: "Admin",
    email: "admin@tmd.dev",
    password: "admin@123",
    role: "admin",
  },
  {
    name: "Demo User",
    email: "user@tmd.dev",
    password: "user@123",
    role: "user",
  },
];

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const SAMPLE_TASKS = (ownerByRole) => [
  {
    title: "Wire up the staging environment",
    description: "Spin up the staging MongoDB cluster and point the deploy at it.",
    priority: "high",
    status: "in-progress",
    dueDate: daysFromNow(2),
    userId: ownerByRole.admin,
  },
  {
    title: "Review pending PRs",
    description: "Three PRs are blocked on review. Try to clear them this week.",
    priority: "medium",
    status: "todo",
    dueDate: daysFromNow(5),
    userId: ownerByRole.admin,
  },
  {
    title: "Draft the Q3 roadmap",
    description: "Pull together the priorities discussed in last week's offsite.",
    priority: "high",
    status: "todo",
    dueDate: daysFromNow(7),
    userId: ownerByRole.admin,
  },
  {
    title: "Finish onboarding checklist",
    description: "Set up local dev, run the test suite, push a sample PR.",
    priority: "medium",
    status: "in-progress",
    dueDate: daysFromNow(3),
    userId: ownerByRole.user,
  },
  {
    title: "Read team handbook",
    priority: "low",
    status: "completed",
    userId: ownerByRole.user,
  },
  {
    title: "Set up dotfiles on the new laptop",
    description: "Mostly editor and shell config.",
    priority: "low",
    status: "todo",
    dueDate: daysFromNow(10),
    userId: ownerByRole.user,
  },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set. Copy .env.example to .env first.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const ownerByRole = {};
    for (const data of SAMPLE_USERS) {
      let user = await User.findOne({ email: data.email });
      if (user) {
        console.log(`User already exists: ${data.email} (${user.role})`);
      } else {
        user = await User.create(data);
        console.log(`Created user: ${data.email} (${user.role})`);
      }
      ownerByRole[user.role] = user._id;
    }

    if (ownerByRole.admin && ownerByRole.user) {
      const userIds = Object.values(ownerByRole);
      const removed = await Task.deleteMany({ userId: { $in: userIds } });
      if (removed.deletedCount > 0) {
        console.log(`Removed ${removed.deletedCount} existing sample task(s)`);
      }
      await Task.insertMany(SAMPLE_TASKS(ownerByRole));
      console.log(`Created ${SAMPLE_TASKS(ownerByRole).length} sample tasks`);
    }

    console.log("\nSample credentials:");
    SAMPLE_USERS.forEach((u) => console.log(`  ${u.role.padEnd(5)}  ${u.email}  /  ${u.password}`));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
