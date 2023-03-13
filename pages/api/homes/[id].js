import { getSession } from 'next-auth/react';

export async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  switch (method) {
    case 'PATCH':

    default:
      res.setHeader('Allow', ['PATCH']);
      res
        .status(405)
        .json({ message: `HTTP method ${method} is not supported.` });
  }
}
