import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../server/auth";

export const requireAuth =
  (func: GetServerSideProps, callbackPath: string) =>
  async (ctx: GetServerSidePropsContext) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session) {
      return {
        redirect: {
          destination: `/api/auth/signin?callbackUrl=/${callbackPath}`,
          permanent: false,
        },
      };
    }

    return await func(ctx);
  };
