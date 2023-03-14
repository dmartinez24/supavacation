import { getSession } from 'next-auth/react';

export async function getHomes(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: {
      owner: { email: session.user.email },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}
