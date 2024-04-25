const users = [
  {
    auth0Id: 'github|7569921',
    email: 'bo@interrobang.consulting',
    firstName: 'Bo',
    isVerified: true,
    lastName: 'Davis',
  },
];

export default async function seedUsers(prisma) {
  for (const user of users) {
    await prisma.user.upsert({
      create: user,
      update: {},
      where: { email: user.email },
    });
  }
}
