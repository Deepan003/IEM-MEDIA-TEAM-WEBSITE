// This script promotes a user to the 'admin' role.
// HOW TO RUN:
// 1. Make sure your server is NOT running.
// 2. Open your terminal in the 'server' directory.
// 3. Run the script with the user's email as an argument:
//    node scripts/make-admin.js your-email@example.com

require('dotenv').config({ path: '../.env' }); // Adjust path to find .env file
const mongoose = require('mongoose');
const User = require('../models/User');

const makeAdmin = async () => {
    // 1. Get the email from the command line arguments
    const userEmail = process.argv[2];

    if (!userEmail) {
        console.error('❌ Please provide the email address of the user you want to make an admin.');
        console.log('Usage: node scripts/make-admin.js <user_email>');
        process.exit(1);
    }

    // 2. Connect to the database
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully! ✅');
    } catch (error) {
        console.error('MongoDB Connection FAILED: ❌', error.message);
        process.exit(1);
    }

    // 3. Find the user and update their role
    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            console.error(`❌ Error: User with email "${userEmail}" not found.`);
            await mongoose.disconnect();
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! ${user.fullName} (${user.email}) has been promoted to Admin.`);

    } catch (error) {
        console.error('An error occurred while updating the user:', error);
        process.exit(1);
    } finally {
        // 4. Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB Disconnected.');
    }
};

makeAdmin();