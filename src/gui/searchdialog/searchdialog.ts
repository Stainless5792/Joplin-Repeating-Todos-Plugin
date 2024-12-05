/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { recurrenceFromJSON, recurrenceToJSON } from '../../model/recurrence';
import { searchNoteByTitle } from '../../core/search'

const fs = joplin.require('fs-extra');

var searchdialog = null;
var HTMLFilePath = null;
var BaseHTML = null


/** createDialog ************************************************************************************************************************************
 * Initializes the recurrence dialog                                                                                                                *
 ***************************************************************************************************************************************************/
export async function setupSearchDialog(){
    HTMLFilePath = (await joplin.plugins.installationDir()) + "/gui/searchdialog/searchdialog.html"
    BaseHTML = await fs.readFile(HTMLFilePath, 'utf8');
    searchdialog = await joplin.views.dialogs.create('searchdialog');
    await joplin.views.dialogs.addScript(searchdialog, './gui/searchdialog/searchdialog.js')
    await joplin.views.dialogs.addScript(searchdialog, './gui/searchdialog/searchdialog.css')
    console.log(`Setup Search Dialog`)
}

/** openDialog **************************************************************************************************************************************
 * Opens the recurrence dialog for the given noteID                                                                                                 *
 ***************************************************************************************************************************************************/
export async function openSearchDialog(){
    await joplin.views.dialogs.setHtml(searchdialog, BaseHTML);
    console.log(`Opening Search Dialog`)
    let formResult = await joplin.views.dialogs.open(searchdialog)

    while (formResult.id == 'ok') {
        // 当 搜索 空 字符串时，弹出提示框，并重新打开搜索框
        while (formResult.id == 'ok' && formResult.formData.searchForm.searchText === '') {
            const click_res = await joplin.views.dialogs.showMessageBox("Please provide a search text")
            if (click_res == 0) {
                formResult = await joplin.views.dialogs.open(searchdialog)
                continue
            }else {
                break
            }
        }
        if (formResult.id == 'ok' && formResult.formData.searchForm.searchText !== '') {
            console.log(`Searching for: ` + JSON.stringify(formResult.formData.searchForm.searchText))
            const result = await searchNoteByTitle(formResult.formData.searchForm.searchText)
            const note_result = result.filter(item => item.is_todo == 0)
            const todo_result = result.filter(item => item.is_todo !== 0)
            const completed_todo_result = todo_result.filter(item => item.todo_completed !== 0)
            const incompleted_todo_result = todo_result.filter(item => item.todo_completed == 0)
            console.log(`result: ` + JSON.stringify(result))

            const search_String = `\n Search Title With: '` + formResult.formData.searchForm.searchText + `'`
            const Total_String = search_String + `\n Fount Total Count: ` + result.length + `\n Note Result: ` + note_result.length + `\n Todo Result: ` + todo_result.length + `\n Completed Todo Result: ` + completed_todo_result.length + `\n Incompleted Todo Result: ` + incompleted_todo_result.length
            const copy_String = `Click 'OK' tp Copy Result to Clipboard`
            const show_Message = Total_String + "\n\n" + copy_String
            
            // TODO : 数据根据 title 排序
            // TODO: 去除不必要的字段

            // markdown result 
            let md_string = `\n\n## Search Result For '` + formResult.formData.searchForm.searchText +`' :\n` + Total_String + `\n\n`
            if (note_result.length > 0) {
                md_string += `### Note Result:\n\n`
                for (let i = 0; i < note_result.length; i++) {
                    md_string += `- [${note_result[i].title}](:/${note_result[i].id})\n`
                }
            }else {
                md_string += `### Note Result: 0 \n\n`
            }
            if (todo_result.length > 0) {
                md_string += `### Todo Result:\n\n`
                if (completed_todo_result.length > 0) {
                    md_string += `#### Completed Todo Result:\n\n`
                    for (let i = 0; i < completed_todo_result.length; i++) {
                        md_string += `- [${completed_todo_result[i].title}](:/${completed_todo_result[i].id})`
                        md_string += ` (Completed) ✅`
                        md_string += `\n`
                    }
                }else {
                    md_string += `#### Completed Todo Result: 0 \n\n`
                }

                if (incompleted_todo_result.length > 0) {
                    md_string += `#### Incompleted Todo Result:\n\n`
                    for (let i = 0; i < incompleted_todo_result.length; i++) {
                        md_string += `- [${incompleted_todo_result[i].title}](:/${incompleted_todo_result[i].id})`
                        md_string += ` (Incompleted) ❌`
                        md_string += `\n`
                    }
                }else {
                    md_string += `#### Incompleted Todo Result: 0 \n\n`
                }
            }else {
                md_string += `### Todo Result: 0 \n\n`
            }
            const click = await joplin.views.dialogs.showMessageBox(show_Message + md_string)
            if (click == 0) {
                await joplin.clipboard.writeText(md_string);
            }else 
            return result.length
        }
        break
    }
    // console.log(`Ready for Searching`)
    // if (formResult.id == 'searchButton' && formResult.formData.searchForm.searchText !== '') {
    // if (formResult.id == 'ok') {
    //     var formResult = await joplin.views.dialogs.open(searchdialog)
    //     console.log(`Ready for Searching`)
    //     if (formResult.id == 'ok' && formResult.formData.searchForm.searchText !== '') {
    //         console.log(`Searching for: ` + JSON.stringify(formResult.formData.searchForm.searchText))
    //         searchNoteByTitle(formResult.formData.searchForm.searchText)
    //         break
    //     }else if (formResult.id == 'cancel') {
    //         break
    //     }else {
    //         continue
    //     }

    // }
    // while (formResult.id == 'ok') {
    //     while (formResult.formData.searchForm.searchText === '') {
    //         await joplin.views.dialogs.showMessageBox("Please provide a search text")
    //         await joplin.views.dialogs.open(searchdialog)
    //         break
    //     }
    //     if (formResult.formData.searchForm.searchText !== '') {
    //     // const searchText = formResult.formData.searchForm.searchText
    //     // var replacedHTML = BaseHTML.replace("search_RESULT", JSON.stringify(`Searching Titles for: ` + searchText))
    //     console.log(`Searching for: ` + JSON.stringify(formResult.formData.searchForm.searchText))
    //     console.log(`Searching for: ` + JSON.stringify(formResult.formData.searchForm.searchText.value))
    //     searchNoteByTitle(formResult.formData.searchForm.searchText.value)
    //     } else {
    //         console.log(`No search text provided`)
    //         await joplin.views.dialogs.showMessageBox("Please provide a search text")
    //         // await joplin.views.dialogs.open(searchdialog)
    //     }

        // console.log(`Searching for: ${searchText}`)
        // await joplin.views.dialogs.setHtml(searchdialog, replacedHTML);
        // // var formResult = await joplin.views.dialogs.open(searchdialog)
        // 

        // return recurrenceFromJSON(atob(formResult.formData.recurrenceForm.recurrenceData))
    // }
}

