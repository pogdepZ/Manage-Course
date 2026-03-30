const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const env = require('./config/env');
const { connectDb } = require('./config/db');

// Models
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Enrollment = require('./models/Enrollment');

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDb(env.mongoUri);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Enrollment.deleteMany({});

    console.log('Creating users...');
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
      department: 'Management'
    });

    const teacher = await User.create({
      name: 'Teacher User',
      email: 'teacher@example.com',
      password: passwordHash,
      role: 'teacher',
      department: 'Computer Science'
    });

    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@example.com',
      password: passwordHash,
      role: 'student'
    });

    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@example.com',
      password: passwordHash,
      role: 'student'
    });

    console.log('Creating courses...');
    const course1 = await Course.create({
      title: 'Introduction to Fastify',
      createdBy: teacher._id
    });

    const course2 = await Course.create({
      title: 'Advanced MongoDB',
      createdBy: teacher._id
    });

    console.log('Creating lessons...');
    await Lesson.insertMany([
      { courseId: course1._id, content: 'Lesson 1: Fastify Basics' },
      { courseId: course1._id, content: 'Lesson 2: Fastify Routing' },
      { courseId: course2._id, content: 'Lesson 1: Mongoose Models' },
      { courseId: course2._id, content: 'Lesson 2: Aggregation Pipeline' }
    ]);

    console.log('Enrolling students...');
    await Enrollment.insertMany([
      { userId: student1._id, courseId: course1._id },
      { userId: student1._id, courseId: course2._id },
      { userId: student2._id, courseId: course1._id }
    ]);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
