import 'reflect-metadata';
import sequelize from './config/database';
import { User } from './models/User';
import { ServiceCategory } from './models/ServiceCategory';
import { Service } from './models/Service';
import { ProviderAvailability } from './models/ProviderAvailability';
import bcrypt from 'bcryptjs';
import { UserRole } from './enums/user-role.enum';

async function seed() {
  await sequelize.sync({ force: false });

  const admin = await User.findOne({ where: { email: 'admin@example.com' } });
  if (!admin) {
    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      phone: '0000000000',
      isActive: true,
    });
    console.log('Admin: admin@example.com / admin123');
  }

  let customer = await User.findOne({ where: { email: 'customer@example.com' } });
  if (!customer) {
    customer = await User.create({
      name: 'John Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: UserRole.CUSTOMER,
      phone: '1111111111',
      isActive: true,
    });
    console.log('Customer: customer@example.com / customer123');
  }

  let provider = await User.findOne({ where: { email: 'provider@example.com' } });
  if (!provider) {
    provider = await User.create({
      name: 'Jane Provider',
      email: 'provider@example.com',
      password: await bcrypt.hash('provider123', 10),
      role: UserRole.PROVIDER,
      phone: '2222222222',
      isActive: true,
    });
    console.log('Provider: provider@example.com / provider123');
  }

  const categories = [
    { name: 'Cleaning', description: 'Home and office cleaning services' },
    { name: 'Plumbing', description: 'Plumbing repair and installation' },
    { name: 'Electrical', description: 'Electrical repair and wiring' },
  ];

  for (const cat of categories) {
    const [record] = await ServiceCategory.findOrCreate({ where: { name: cat.name }, defaults: cat });
    if (record.name === 'Cleaning') {
      await Service.findOrCreate({
        where: { name: 'Home Deep Cleaning' },
        defaults: {
          name: 'Home Deep Cleaning',
          description: 'Complete deep cleaning of your home',
          price: 120,
          durationMinutes: 240,
          categoryId: record.id,
          isActive: true,
        },
      });
      await Service.findOrCreate({
        where: { name: 'Sofa Cleaning' },
        defaults: {
          name: 'Sofa Cleaning',
          description: 'Professional sofa and upholstery cleaning',
          price: 50,
          durationMinutes: 90,
          categoryId: record.id,
          isActive: true,
        },
      });
    }
    if (record.name === 'Plumbing') {
      await Service.findOrCreate({
        where: { name: 'Plumbing Consultation' },
        defaults: {
          name: 'Plumbing Consultation',
          description: 'Expert plumbing inspection and advice',
          price: 30,
          durationMinutes: 60,
          categoryId: record.id,
          isActive: true,
        },
      });
    }
    if (record.name === 'Electrical') {
      await Service.findOrCreate({
        where: { name: 'Electrical Wiring' },
        defaults: {
          name: 'Electrical Wiring',
          description: 'Safe electrical wiring and repairs',
          price: 85,
          durationMinutes: 120,
          categoryId: record.id,
          isActive: true,
        },
      });
    }
  }

  if (provider) {
    const existing = await ProviderAvailability.count({ where: { providerId: provider.id } });
    if (existing === 0) {
      await ProviderAvailability.bulkCreate([
        { providerId: provider.id, dayOfWeek: 1, startTime: '09:00:00', endTime: '17:00:00' },
        { providerId: provider.id, dayOfWeek: 2, startTime: '09:00:00', endTime: '17:00:00' },
        { providerId: provider.id, dayOfWeek: 3, startTime: '09:00:00', endTime: '17:00:00' },
        { providerId: provider.id, dayOfWeek: 4, startTime: '09:00:00', endTime: '17:00:00' },
        { providerId: provider.id, dayOfWeek: 5, startTime: '09:00:00', endTime: '17:00:00' },
      ]);
      console.log('Provider availability seeded');
    }
  }

  console.log('Seed completed');
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
