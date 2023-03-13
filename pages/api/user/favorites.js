import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
  }

  switch (method) {
    case 'GET':
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { favoriteHomes: true },
      });

      res.status(200).json(user.favoriteHomes);

      break;

    default:
      res.headers('Allow', ['GET']);
      res
        .status(405)
        .json({ message: `HTTP method ${method} is not supported.` });
  }
}
