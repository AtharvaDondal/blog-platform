import { appRouter } from '../../server/routers/_app';

export const serverClient = appRouter.createCaller({});