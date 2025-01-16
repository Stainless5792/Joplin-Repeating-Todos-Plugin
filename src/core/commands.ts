/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openRecurrenceDialog, setOverdueTodosToToday, updateAllRecurrences, updateOverdueTodos, setWeeklyRecurrence, setDailyRecurrence, setMonthlyRecurrence, setNoRecurrence,toggleTodoStatus } from "./recurrence";
import { openSearchNoteByTitleDialog } from "./search";
import { openSetNoteAlarmDialog } from "./setAlarm";

/** setupCommands ***********************************************************************************************************************************
 * Sets up all commands used by toolbar buttons and menu items                                                                                      *
 ***************************************************************************************************************************************************/
export async function setupCommands(){
    await joplin.commands.register({
        name: 'updateAllRecurrences',
        label: 'Update All Recurrence Information',
        iconName: 'fas fa-redo-alt',
        execute: updateAllRecurrences
    })
    await joplin.commands.register({
        name: 'updateOverdueTodos',
        label: 'Update Overdue To-Dos',
        iconName: 'fas fa-redo-alt',
        execute: updateOverdueTodos
    })
    await joplin.commands.register({
        name: 'setOverdueTodosToToday',
        label: 'Reschedule Overdue To-Dos to Today',
        iconName: 'fas fa-redo-alt',
        execute: setOverdueTodosToToday
    })
    await joplin.commands.register({
        name: 'setNoRecurrence',
        label: 'set todo no recurrence',
        iconName: 'fas fa-redo-alt',
        execute: setNoRecurrence
    })
    await joplin.commands.register({
        name: 'toggleTodoStatus',
        label: 'toggle todo status',
        iconName: 'fas fa-redo-alt',
        execute: toggleTodoStatus
    })
    await joplin.commands.register({
        name: 'setMonthlyRecurrence',
        label: 'set todo Monthly recurrence',
        iconName: 'fas fa-redo-alt',
        execute: setMonthlyRecurrence
    })
    await joplin.commands.register({
        name: 'setWeeklyRecurrence',
        label: 'set todo weekly recurrence',
        iconName: 'fas fa-redo-alt',
        execute: setWeeklyRecurrence
    })
    await joplin.commands.register({
        name: 'setDailyRecurrence',
        label: 'set todo weekday recurrence',
        iconName: 'fas fa-redo-alt',
        execute: setDailyRecurrence
    })

    await joplin.commands.register({
        name: 'openRecurrenceDialog',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openRecurrenceDialog
    })

    await joplin.commands.register({
        name: 'openSearchNoteByTitleDialog',
        label: 'Open SearchNoteByTitle Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openSearchNoteByTitleDialog
    })
    await joplin.commands.register({
        name: 'openSetNoteAlarmDialog',
        label: 'open SetNoteAlarm Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openSetNoteAlarmDialog
    })

    await joplin.commands.register({
        name: 'openRecurrenceDialog',
        label: 'Open Recurrence Dialog',
        iconName: 'fas fa-redo-alt',
        execute: openRecurrenceDialog
    })
}