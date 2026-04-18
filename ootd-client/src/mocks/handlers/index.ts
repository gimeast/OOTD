import { authHandlers } from './auth';
import { ootdHandlers } from './ootd';
import { memberHandlers } from './member';
import { hashtagHandlers } from './hashtag';

export const handlers = [...authHandlers, ...ootdHandlers, ...memberHandlers, ...hashtagHandlers];
