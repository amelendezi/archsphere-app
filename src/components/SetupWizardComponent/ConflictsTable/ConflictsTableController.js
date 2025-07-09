
import { resolveSingleApplicationConflictCommand } from '../../../services/command/resolveSingleApplicationConflictCommand';
import { unresolveSingleApplicationConflictCommand } from '../../../services/command/unresolveSingleApplicationConflictCommand';
import { resolveByIgnoringSingleApplicationConflictCommand } from '../../../services/command/resolveByIgnoringSingleApplicationConflictCommand';
import { unresolveByIgnoringSingleApplicationConflictCommand } from '../../../services/command/unresolveByIgnoringSingleApplicationConflictCommand';
import { getAllApplicationConflictsQuery } from '../../../services/query/getAllApplicationConflictsQuery';

export const handleAction = async (actionType, item, setRowActionStates, setRefreshConflictsTable) => {
    const conflictId = `${item['Business Application ID']}-${item['Property Name']}`;
    let newStatus = '';

    switch (actionType) {
        case 'resolve':
            await resolveSingleApplicationConflictCommand(undefined, item['Business Application ID'], item['Property Name'], item['New Value']);
            newStatus = 'resolved';
            break;
        case 'ignore':
            await resolveByIgnoringSingleApplicationConflictCommand(item['Business Application ID'], item['Property Name']);
            newStatus = 'resolved';
            break;
        case 'undoResolve':
            await unresolveSingleApplicationConflictCommand(undefined, item['Business Application ID'], item['Property Name'], item['Old Value']);
            newStatus = 'unresolved';
            break;
        case 'undoIgnore':
            await unresolveByIgnoringSingleApplicationConflictCommand(item['Business Application ID'], item['Property Name']);
            newStatus = 'unresolved';
            break;
        default:
            return;
    }

    setRowActionStates(prev => {
        const newState = new Map(prev);
        newState.set(conflictId, newStatus);
        return newState;
    });
    
    setRefreshConflictsTable(prev => !prev);
};

export const conflictDataFetcher = async () => {
    return await getAllApplicationConflictsQuery();
};
