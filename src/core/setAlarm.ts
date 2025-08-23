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
  var selectedNote = await joplin.workspace.selectedNote()
  // get alarm for note
  const beforeAlarm = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'todo_due'] });
  // const beforeAlarm = await joplin.data.get(['alarms', selectedNote.id], { fields: ['id', 'note_id', 'trigger_time'] });
  const triggerTime = beforeAlarm.todo_due; // Epoch 毫秒时间戳
  console.log("triggerTime:" + triggerTime)


  // 转换为本地时间字符串（如果系统时区是 UTC+8，则自动为北京时间）
  const utc8Time = new Date(triggerTime).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
  }).replace(/\//g, '-');

  openAlarmDialog(utc8Time);
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
