/** Imports ****************************************************************************************************************************************/
import joplin from "api";
// import { openSearchDialog } from "../gui/searchdialog/searchdialog";
import { openAlarmDialog } from "../gui/setAlarmdialog/setAlarmdialog";
import { setTaskDueDate } from "./joplin";

/** openSearchNoteByTitleDialog ****************************************************************************************************************************
 * Opens the searchNoteByTitle dialog *
 ***************************************************************************************************************************************************/
// export async function openSearchNoteByTitleDialog() {
//   openSearchDialog();
// }
export async function openSetNoteAlarmDialog() {
  openAlarmDialog();
}

/** setNoteAlarm ***
 * Sets the alarm for the note with the given date *
 **********/
export async function setNoteAlarm(searchText: string) {
    var selectedNote = await joplin.workspace.selectedNote()
    // 设置alarm 为当前时间
    // 假设 searchText 是 "2025-01-16 18:00"
    const dateString = searchText;
    const date = new Date(dateString);

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
        console.log("无效的日期格式");
        return;
    }

    // 获取 epoch time
    const epochTime = date.getTime();

    // 设置alarm 为给定的时间
    await setTaskDueDate(selectedNote.id, new Date(epochTime))

    // await setTaskDueDate(selectedNote.id, new Date(Date.now() + 2 * 3600 * 1000))
}

// // 根据正则表达式搜索note
// export async function searchNoteByTitle(searchText: string) {
//   // DONE 增加正则表达式支持, joplin 自带的搜索功能不支持正则表达式， 造成搜索结果不准确
//   var allNotes = [];
//   var pageNum = 0;
//   do {
//     var response = await joplin.data.get(["notes"], {
//       fields: ["title", "id", "is_todo", "todo_completed"],
//       page: pageNum++,
//     });
//     allNotes = allNotes.concat(response.items);
//   } while (response.has_more);

//   // 定义正则表达式
//   const regex = new RegExp(searchText);

//   console.log(`regex: ` + regex);
//   // 使用 filter 方法进行正则表达式匹配
//   const filteredResult = allNotes.filter((item) => regex.test(item.title));
//   console.log(`filteredResult: ` + JSON.stringify(filteredResult));

//   return filteredResult;

//   // https://joplinapp.org/help/api/references/rest_api#filtering-data
//   // https://joplinapp.org/help/apps/search

// }
