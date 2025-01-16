/* Imports *****************************************************************************************************************************************/
import joplin from 'api';
import { setupDatabase } from './core/database';
import { setupDialog } from './gui/dialog/dialog';
import { setupSearchDialog } from './gui/searchdialog/searchdialog';
import { setAlarmdialog } from './gui/setAlarmdialog/setAlarmdialog';
import { setupMenu } from './gui/menu';
import { setupTimer } from './core/timer';
import { setupSettings } from './core/settings';
import { setupToolbar } from './gui/toolbar';
import { setupCommands } from './core/commands';

/** Plugin Registration *****************************************************************************************************************************
 * Registers the plugin with joplin.                                                                                                                *
 ***************************************************************************************************************************************************/
joplin.plugins.register({
    onStart: main,
});

/** Main ********************************************************************************************************************************************
 * Calls all the functions needed to initialize the plugin                                                                                          *
 ***************************************************************************************************************************************************/
async function main() {
    await setupDatabase()
    await setupSettings()
    await setupCommands()
    await setupDialog()
    await setupSearchDialog()
    await setAlarmdialog()
    await setupMenu()
    await setupToolbar()
    await setupTimer()
}