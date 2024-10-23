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
            {commandName: 'setMonthlyRecurrence',accelerator: "Ctrl+Shift+M"},
            {commandName: 'setWeeklyRecurrence',accelerator: "Ctrl+Shift+W"},
            {commandName: 'setDailyRecurrence',accelerator: "Ctrl+Shift+D"},
            {commandName: 'openRecurrenceDialog',accelerator: "Ctrl+Shift+O"},
            {commandName: 'setOverdueTodosToToday'}
        ],
        MenuItemLocation.Tools
    )
}
