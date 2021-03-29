import produce, { Draft } from 'immer';

import { Action } from './actions';
import { DELAY, descriptors, DRAFT_STATE, errors, INTERVAL, State } from './types';

import { countVotesForUser } from './selectUserFunction';

export function die(error: keyof typeof errors, ...args: any[]): never {
    const e = errors[error];
    const msg = !e
        ? 'unknown error nr: ' + error
        : typeof e === 'function'
            // @ts-ignore
            ? e.apply(null, args as any) : e;
    throw new Error(`[function] ${msg}`);
}

function assertUnrevoked(state: any) {
    if (state.revoked_) die(1, JSON.stringify(state));
}

export const data = produce((draft: Draft<State>, action: Action) => {
    switch (action.type) {
        case 'timer':
            if (!draft.pause) {
                draft.progress += INTERVAL;
            }
            break;
        case 'prev':
            draft.pause = false;
            draft.progress = 0;
            draft.index = Math.max(draft.index - 1, 0);
            break;
        case 'next':
            if (draft.index + 1 < draft.stories.length) {
                draft.index++;
                draft.progress = 0;
            } else if (draft.index + 1 === draft.stories.length) {
                draft.progress = DELAY;
                draft.pause = true;
            } else draft.pause = true;
            break;
        case 'restart':
            draft.pause = false;
            draft.progress = 0;
            draft.index = 0;
            break;
        case 'update':
            const { alias, data } = action.data;

            if (alias) {
                draft.stories[draft.index].alias = alias;
            }

            if (data) {
                Object.assign(draft.stories[draft.index].data, data);
            }

            break;
        case 'theme':
            draft.theme = action.theme;
            break;
        case "pause":
            if (action.pause) draft.pause = true;
            else if (draft.index + 1 <= draft.stories.length && draft.progress !== DELAY) draft.pause = false;
            break;
        case "selectUser":
            const data2 = action.data.data;
            //@ts-ignore
            let users = draft.stories[draft.index + 1].data.users;
            //@ts-ignore
            countVotesForUser(draft.stories[draft.index].data.selectedUserId, -1, users);
            //@ts-ignore
            countVotesForUser(data2.selectedUserId, 1, users);
            
            if (data2) {
              Object.assign(draft.stories[draft.index].data, data2)
              Object.assign(draft.stories[draft.index + 1].data, data2);
            }
            break;
    }
});

export function proxyProperty(
    prop: string | number,
    enumerable: boolean
): PropertyDescriptor {
    let desc = descriptors[prop];
    if (desc) {
        desc.enumerable = enumerable;
    } else {
        descriptors[prop] = desc = {
            configurable: true,
            enumerable,
            get(this: any) {
                const state = this[DRAFT_STATE];
                assertUnrevoked(state);
                // @ts-ignore
                return objectTraps.get(state, prop);
            },
            set(this: any, value) {
                const state = this[DRAFT_STATE];
                assertUnrevoked(state);
                // @ts-ignore
                objectTraps.set(state, prop, value);
            },
        };
    }
    return desc;
}
