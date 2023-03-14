import { getSession } from 'next-auth/react';
import { prisma } from '../../../../server/db/client';

export default async function handler(req, res) {
  const { method } = req;

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized.' });
  }

  const { id } = req.query;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  const home = user?.listedHomes?.find((home) => home.id === id);

  if (!home) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  switch (method) {
    case 'PUT':
      try {
        const user = await prisma.user.update({
          where: { email: session.user.email },
          data: {
            favoriteHomes: {
              connect: {
                id,
              },
            },
          },
        });

        res.status(200).json(home);
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong.' });
      }
      break;
    case 'DELETE':
      try {
        const user = await prisma.user.update({
          where: { email: session.user.email },
          data: {
            favoriteHomes: {
              disconnect: { id },
            },
          },
        });

        res.status(200).json(home);
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Something went wrong.' });
      }
      break;
    default:
      res.headers('Allow', ['PUT', 'DELETE']);
      res
        .status(405)
        .json({ message: `HTTP method ${method} is not supported.` });
  }
}
