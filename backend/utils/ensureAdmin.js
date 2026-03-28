const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * ensureAdminExists
 * - Idempotent: creates admin only if none exists
 * - Safe: hashes password and uses strict role check
 * - Scalable: supports env overrides while providing sane defaults
 */
module.exports = async function ensureAdminExists() {
  try {
    // Prefer env overrides for production
    const defaultName = process.env.ADMIN_NAME || 'Super Admin';
    const defaultEmail = (process.env.ADMIN_EMAIL || 'admin@neogen.com').toLowerCase().trim();
    const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    // Check if any admin exists
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount > 0) {
      console.log('[Bootstrap] Admin user already exists. Skipping creation.');
      return;
    }

    // Create a new admin
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const adminUser = await User.create({
      name: defaultName,
      email: defaultEmail,
      password: hashedPassword,
      role: 'admin',
      active: true,
      isVerified: true // will be ignored if not in schema; harmless
    });

    console.log('\n════════ Admin Bootstrap ═════════');
    console.log(`✅ Admin created successfully`);
    console.log(`👤 Name:     ${adminUser.name}`);
    console.log(`📧 Email:    ${adminUser.email}`);
    console.log('🔐 Password: (hidden)');
    console.log('🔎 Role:     admin');
    console.log('════════════════════════════════════\n');
  } catch (err) {
    console.error('[Bootstrap] Failed to ensure admin exists:', err.message);
  }
}
