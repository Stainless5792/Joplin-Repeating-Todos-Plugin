/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { MenuItemLocation } from 'api/types';

/** setupMenu ***************************************************************************************************************************************
 * Sets up the menu used by the plugin                                                                                                              *
 ***************************************************************************************************************************************************/
export async function setupMenu(){
    await joplin.views.menus.create(
        'recurrenceMenu', 
        "Repeating Todos", 
        [
            {commandName: 'updateAllRecurrences'},
            {commandName: 'updateOverdueTodos'},
            {commandName: 'setNoRecurrence',accelerator: "Ctrl+Shift+U"},
            {commandName: 'toggleTodoStatus',accelerator: "Ctrl+Shift+T"},
            {commandName: 'setMonthlyRecurrence',accelerator: "Ctrl+Shift+M"},
            {commandName: 'setYearlyRecurrence',accelerator: "Ctrl+Shift+Y"},
            {commandName: 'setWeeklyRecurrence',accelerator: "Ctrl+Shift+W"},
            {commandName: 'setDailyRecurrence',accelerator: "Ctrl+Shift+D"},
            {commandName: 'openRecurrenceDialog',accelerator: "Ctrl+Shift+O"},
            {commandName: 'openSearchNoteByTitleDialog',accelerator: "Ctrl+Shift+S"},
            {commandName: 'openSetNoteAlarmDialog',accelerator: "Ctrl+Shift+A"},
            {commandName: 'setOverdueTodosToToday'}
        ],
        MenuItemLocation.Tools
    )
}
