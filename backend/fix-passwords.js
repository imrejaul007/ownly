import sequelize from './src/config/database.js';
import { User } from './src/models/index.js';
import bcrypt from 'bcryptjs';

const fixPasswords = async () => {
  try {
    console.log('🔧 Fixing user passwords...');

    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get all users
    const users = await User.findAll();
    console.log(`📊 Found ${users.length} users`);

    for (const user of users) {
      // Determine the plain password based on role
      let plainPassword;
      if (user.email === 'admin@ownly.ae') {
        plainPassword = 'admin123';
      } else {
        plainPassword = 'investor123';
      }

      // Hash the password correctly (will be hashed again by beforeUpdate hook)
      // So we pass the plain password and let the model handle it
      await User.update(
        { password: plainPassword },
        {
          where: { id: user.id },
          individualHooks: true // This ensures beforeUpdate runs
        }
      );

      console.log(`  ✅ Fixed password for: ${user.email}`);
    }

    console.log('\\n🎉 All passwords fixed!');
    console.log('\\nYou can now login with:');
    console.log('  Investors: [email] / investor123');
    console.log('  Admin: admin@ownly.ae / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPasswords();
