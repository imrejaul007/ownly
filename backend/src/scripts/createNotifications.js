import sequelize from '../config/database.js';
import { User, Notification } from '../models/index.js';

const createSampleNotifications = async () => {
  try {
    console.log('🔔 Creating sample notifications...');

    const users = await User.findAll({ where: { role: 'investor_hni' }, limit: 5 });
    console.log(`📊 Found ${users.length} investors`);

    const notificationTypes = [
      {
        type: 'investment',
        title: 'Investment Confirmed',
        message: 'Your investment has been successfully processed and confirmed.',
        priority: 'high',
        link: '/portfolio'
      },
      {
        type: 'payout',
        title: 'Monthly Payout Received',
        message: 'You have received your monthly payout. Check your wallet for details.',
        priority: 'normal',
        link: '/wallet'
      },
      {
        type: 'deal_update',
        title: 'New Deal Available',
        message: 'A new premium real estate opportunity is now available for investment.',
        priority: 'normal',
        link: '/'
      },
      {
        type: 'kyc_status',
        title: 'KYC Status Approved',
        message: 'Your KYC verification has been approved. You can now invest in all opportunities.',
        priority: 'high',
        link: '/settings'
      },
      {
        type: 'announcement',
        title: 'Platform Update',
        message: 'New features have been added to the platform. Check out the wallet management page!',
        priority: 'low',
        link: '/wallet'
      },
      {
        type: 'system',
        title: 'Welcome to OWNLY Sandbox',
        message: 'Welcome! Explore investment opportunities and track your portfolio performance.',
        priority: 'normal',
        link: '/dashboard'
      }
    ];

    let created = 0;

    for (const user of users) {
      // Create 3-5 random notifications for each user
      const numNotifications = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < numNotifications; i++) {
        const notif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 14)); // Random date within last 2 weeks

        await Notification.create({
          user_id: user.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          priority: notif.priority,
          read: Math.random() > 0.5, // 50% chance of being read
          link: notif.link,
          created_at: createdAt
        });

        created++;
      }

      console.log(`✅ Created notifications for: ${user.email}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${created} notifications`);
    console.log(`   For: ${users.length} users`);
    console.log('\n🎉 Notification creation complete!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating notifications:', error);
    process.exit(1);
  }
};

createSampleNotifications();
