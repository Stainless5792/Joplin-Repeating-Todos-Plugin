/** Imports ***********************************************/
import joplin from 'api';
// import { searchNoteByTitle } from '../../core/search';
import { setNoteAlarm } from '../../core/setAlarm';

const fs = joplin.require('fs-extra');

var alarmdialog = null;
var HTMLFilePath = null;
var BaseHTML = null


/** createDialog ***********************
 * Initializes the recurrence dialog             ************************/
export async function setAlarmdialog(){
    HTMLFilePath = (await joplin.plugins.installationDir()) + "/gui/setAlarmdialog/setAlarmdialog.html"
    BaseHTML = await fs.readFile(HTMLFilePath, 'utf8');
    alarmdialog = await joplin.views.dialogs.create('alarmdialog');
    await joplin.views.dialogs.addScript(alarmdialog, './gui/setAlarmdialog/setAlarmdialog.js')
    await joplin.views.dialogs.addScript(alarmdialog, './gui/setAlarmdialog/setAlarmdialog.css')
    console.log(`Setup Search Dialog`)
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openAlarmDialog(utc8Time){
    // await joplin.views.dialogs.setHtml(alarmdialog, BaseHTML);
    // 使用 replace 方法将 span 标签内的内容替换为 utc8Time
    let modifiedHTML = BaseHTML.replace('@@beforeAlarmValue@@', utc8Time);
    
    // 将修改后的 HTML 设置到对话框中
    await joplin.views.dialogs.setHtml(alarmdialog, modifiedHTML);
    const buttons: any[] = [
        {
            id: 'ok',
            title: 'Set Alarm'
            // onClick: async () => {
            //     const result = await searchNoteByTitle(formResult.formData.searchForm.searchText)
            //     console.log(`Search Result: ` + JSON.stringify(result))
            //     return result.length
            // }
        },
        {
            id: 'cancel',
            title: 'Cancel'
            // onClick: async () => {
            //     return 0
            // }
        }
    ]
    await joplin.views.dialogs.setButtons(alarmdialog, buttons);
    // await joplin.views.dialogs.setFitToContent(alarmdialog, false);
    console.log(`Opening Search Dialog`)
    let formResult = await joplin.views.dialogs.open(alarmdialog)

    while (formResult.id == 'ok') {
        // 当 搜索 空 字符串时，弹出提示框，并重新打开搜索框
        while (formResult.id == 'ok' && formResult.formData.searchForm.searchText === '') {
            const click_res = await joplin.views.dialogs.showMessageBox("Please provide a alarm Date")
            if (click_res == 0) {
                formResult = await joplin.views.dialogs.open(alarmdialog)
                continue
            }else {
                break
            }
        }
        if (formResult.id == 'ok' && formResult.formData.searchForm.searchText !== '') {
            await setNoteAlarm(formResult.formData.searchForm.searchText)
        }
        break
    }
}

