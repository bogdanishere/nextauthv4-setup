import { PrismaClient } from "@prisma/client";

import bcrypt, { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const user = {
    email: "admin@test.com",
    password: "admin@test.com",
    isAdmin: true,
  };

  const hashedPassword = await hash(user.password, 10);

  const oldPassword = user.password;

  user.password = hashedPassword; // hash the password before saving

  await bcrypt.compare(oldPassword, user.password);

  await prisma.user.create({
    data: user,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
