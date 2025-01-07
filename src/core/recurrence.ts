/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { openDialog } from '../gui/dialog/dialog';
import { createRecord, getAllRecords, getRecord, updateRecord, deleteRecord} from './database';
import { getAllNotes, getNote, markTaskIncomplete, setTaskDueDate,unsetTaskDueDate, markSubTasksIncomplete, markTaskComplete } from "./joplin";
import { Recurrence } from '../model/recurrence';
import { sleep } from './misc';
import { start } from 'repl';


var updating = false;


/** openRecurrenceDialog ****************************************************************************************************************************
 * Opens the recurrence dialog with recurrence data for the current note and saves the recurrence data to the database on dialog closure            *
 ***************************************************************************************************************************************************/
 export async function openRecurrenceDialog(){
    var selectedNote = await joplin.workspace.selectedNote()
    var oldRecurrence = await getRecord(selectedNote.id)
    var newRecurrence = await openDialog(oldRecurrence)
    if (newRecurrence){
        await updateRecord(selectedNote.id, newRecurrence)

        // 获取当前笔记的 body
        const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
        // 获取当前时间的时间戳
        const options = { hour12: false, timeZone: 'Asia/Shanghai' };
        var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式
        var body = "> " + timestamp + " ";

        // 解析 newRecurrence 中的信息
        if (newRecurrence.enabled){
            body += "Repeat Set As: "
            // Valid values are: ['minute', 'hour', 'day', 'week', 'month', 'year']    
            if (newRecurrence.interval == "minute"){
                body += "Every " + newRecurrence.intervalNumber + " minute(s)"
            } else if (newRecurrence.interval == "hour"){
                body += "Every " + newRecurrence.intervalNumber + " hour(s)"
            } else if (newRecurrence.interval == "day"){
                body += "Every " + newRecurrence.intervalNumber + " day(s)"
            } else if (newRecurrence.interval == "week"){
                body += "Every " + newRecurrence.intervalNumber + " week(s)"
                if (newRecurrence.weekSunday){
                    body += " on Sunday"
                }
                if (newRecurrence.weekMonday){
                    body += " on Monday"
                }
                if (newRecurrence.weekTuesday){
                    body += " on Tuesday"
                }
                if (newRecurrence.weekWednesday){
                    body += " on Wednesday"
                }
                if (newRecurrence.weekThursday){
                    body += " on Thursday"
                }
                if (newRecurrence.weekFriday){
                    body += " on Friday"
                }
                if (newRecurrence.weekSaturday){
                    body += " on Saturday"
                }
            } else if (newRecurrence.interval == "month"){
                body += "Every " + newRecurrence.intervalNumber + " month(s)"
                if (newRecurrence.monthWeekday){
                    body += " on " + newRecurrence.monthOrdinal + " " + newRecurrence.monthWeekday
                }
            } else if (newRecurrence.interval == "year"){
                body += "Every " + newRecurrence.intervalNumber + " year(s)"
            }
            
            if (newRecurrence.stopType == "date"){
                body += " ;Stop after " + newRecurrence.stopDate
            } else if (newRecurrence.stopType == "number"){
                body += " ;Stop after " + newRecurrence.stopNumber + " times"
            }
        } else {
            body += "Repeat Set As: No Repeat!"
        }
        body += "\n" + note.body;
        console.log("body:" + body)
        // 更新当前笔记的 body
        await joplin.data.put(['notes', selectedNote.id], null, { body: body });
    }
}

/** updateDatabase **********************************************************************************************************************************
 * This function synchronizes the recurrence database with joplin notes and todos by Creating a recurrence record in the database for each          *
 * note/todo in joplin if it doesnt exist and deleting recurrence records from the database if it doesnt have a corresponding note in joplin        *
 ***************************************************************************************************************************************************/
export async function updateAllRecurrences(){
    if (updating) return;
    updating = true;
    var allNotes = await getAllNotes()
    var allRecurrences = await getAllRecords()
    for (var note of allNotes){
        if (!allRecurrences.some(record => record.id == note.id)){
            await createRecord(note.id, new Recurrence())
        }
        await processTodo(note)
    }
    for (var record of allRecurrences){
        if (!allNotes.some(note => note.id == record.id)){
            await deleteRecord(record.id)
        }
    }
    updating = false;
}

// 取消重复
export async function setNoRecurrence() {
    // 获取当前选中的笔记
    var selectedNote = await joplin.workspace.selectedNote();
    // 获取当前选中笔记的旧的重复记录
    var oldRecurrence = await getRecord(selectedNote.id);
    
    // 创建一个新的重复的实例
    var noRecurrence = new Recurrence();
    noRecurrence.enabled = false; // 取消重复
    
    if (oldRecurrence == null) {
        await createRecord(selectedNote.id, noRecurrence); // 创建新的重复记录
    } else {
        await updateRecord(selectedNote.id, noRecurrence); // 更新现有的重复记录
    }
    joplin.views.dialogs.showMessageBox("已设置为: 取消重复")
    unsetTaskDueDate(selectedNote.id)

    // 获取当前笔记的 body
    const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
    // 获取当前时间的时间戳
    const options = { hour12: false, timeZone: 'Asia/Shanghai' };
    var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式
    var body = "> " + timestamp + " Repeat Set As: No Repeat!";
    body += "\n" + note.body;
    console.log("body:" + body)
    // 更新当前笔记的 body
    await joplin.data.put(['notes', selectedNote.id], null, { body: body });

    openRecurrenceDialog()
    // 输出日志，确认添加了每月重复
    console.log("Monthly repeat added to node: ", selectedNote.id);
    console.log("Monthly repeat added to node: ", selectedNote.title);
}

// toggle todo_completed status 
export async function toggleTodoStatus() {
    // 获取当前选中的笔记
    var selectedNote = await joplin.workspace.selectedNote();
    var is_todo = selectedNote.is_todo;

    if (is_todo) {

        // 获取当前笔记的 body
        const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
        // 获取当前时间的时间戳
        const options = { hour12: false, timeZone: 'Asia/Shanghai' };
        var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式

        var body = "";
        var done_body = "> " + timestamp + " Set Todo Status: 已完成";
        var undone_body = "> " + timestamp + " Set Todo Status: 未完成";

        done_body += "\n" + note.body;
        undone_body += "\n" + note.body;

        var todo_completed = selectedNote.todo_completed;
        if (todo_completed == 0) {
            await markTaskComplete(selectedNote.id)
            body = done_body
            console.log("body:" + body)
            // 更新当前笔记的 body
            await joplin.data.put(['notes', selectedNote.id], null, { body: body });
            joplin.views.dialogs.showMessageBox("标记为: 已完成")
        } else {
            await markTaskIncomplete(selectedNote.id)
            body = undone_body
            console.log("body:" + body)
            // 更新当前笔记的 body
            await joplin.data.put(['notes', selectedNote.id], null, { body: body });
            joplin.views.dialogs.showMessageBox("标记为: 未完成")
        }
    }
}

// 每月重复一次
export async function setMonthlyRecurrence() {
    // 获取当前选中的笔记
    var selectedNote = await joplin.workspace.selectedNote();
    // 获取当前选中笔记的旧的重复记录
    var oldRecurrence = await getRecord(selectedNote.id);
    
    // 创建一个新的每月重复的实例
    var monthlyRecurrence = new Recurrence();
    monthlyRecurrence.enabled = true; // 启用重复
    monthlyRecurrence.interval = 'month'; // 设置重复间隔为每月
    
    // 1. 首先检查是否存在Record，如果没有则插入一个新的记录
    // 2. 如果存在，更新Record以设置为每月重复
    if (oldRecurrence == null) {
        await createRecord(selectedNote.id, monthlyRecurrence); // 创建新的重复记录
    } else {
        await updateRecord(selectedNote.id, monthlyRecurrence); // 更新现有的重复记录
    }
    joplin.views.dialogs.showMessageBox("已设置为: 每月重复一次")

    // 获取当前笔记的 body
    const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
    // 获取当前时间的时间戳
    const options = { hour12: false, timeZone: 'Asia/Shanghai' };
    var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式
    var body = "> " + timestamp + " Repeat Set As: Monthly";
    body += "\n" + note.body;
    console.log("body:" + body)
    // 更新当前笔记的 body
    await joplin.data.put(['notes', selectedNote.id], null, { body: body });

    // 设置alarm 为当前时间
    await setTaskDueDate(selectedNote.id, new Date(Date.now() + 2 * 3600 * 1000))
    openRecurrenceDialog()
    // 输出日志，确认添加了每月重复
    console.log("Monthly repeat added to node: ", selectedNote.id);
    console.log("Monthly repeat added to node: ", selectedNote.title);
}


// 每周重复一次
export async function setWeeklyRecurrence() {
    // 获取当前选中的笔记
    var selectedNote = await joplin.workspace.selectedNote();
    // 获取当前选中笔记的旧的重复记录
    var oldRecurrence = await getRecord(selectedNote.id);
    
    // 创建一个新的每周重复的实例
    var weeklyRecurrence = new Recurrence();
    weeklyRecurrence.enabled = true; // 启用重复
    weeklyRecurrence.interval = 'week'; // 设置重复间隔为每周
    
    // 1. 首先检查是否存在Record，如果没有则插入一个新的记录
    // 2. 如果存在，更新Record以设置为每周重复
    if (oldRecurrence == null) {
        await createRecord(selectedNote.id, weeklyRecurrence); // 创建新的重复记录
    } else {
        await updateRecord(selectedNote.id, weeklyRecurrence); // 更新现有的重复记录
    }
    joplin.views.dialogs.showMessageBox("已设置为: 每周重复一次")

    // 获取当前笔记的 body
    const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
    // 获取当前时间的时间戳
    const options = { hour12: false, timeZone: 'Asia/Shanghai' };
    var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式
    var body = "> " + timestamp + " Repeat Set As: Weekly";
    body += "\n" + note.body;
    console.log("body:" + body)
    // 更新当前笔记的 body
    await joplin.data.put(['notes', selectedNote.id], null, { body: body });

    // 设置alarm 为当前时间
    await setTaskDueDate(selectedNote.id, new Date(Date.now() + 2 * 3600 * 1000))
    openRecurrenceDialog()
    // 输出日志，确认添加了每周重复
    console.log("Weekly repeat added to node: ", selectedNote.id);
    console.log("Weekly repeat added to node: ", selectedNote.title);
}


export async function setDailyRecurrence(){
    // 获取当前选中的笔记
    var selectedNote = await joplin.workspace.selectedNote();
    // 获取当前选中笔记的旧的重复记录
    var oldRecurrence = await getRecord(selectedNote.id);
    
    // 创建一个新的每周重复的实例
    var weeklyRecurrence = new Recurrence();
    weeklyRecurrence.enabled = true; // 启用重复
    weeklyRecurrence.interval = 'week'; // 设置重复间隔为每周
    weeklyRecurrence.weekMonday = true; // 设置周一为每周重复
    weeklyRecurrence.weekTuesday = true; // 设置周二为每周重复  
    weeklyRecurrence.weekWednesday = true; // 设置周三为每周重复
    weeklyRecurrence.weekThursday = true; // 设置周四为每周重复
    weeklyRecurrence.weekFriday = true; // 设置周五为每周重复
    
    // 1. 首先检查是否存在Record，如果没有则插入一个新的记录
    // 2. 如果存在，更新Record以设置为每周重复
    if (oldRecurrence == null) {
        await createRecord(selectedNote.id, weeklyRecurrence); // 创建新的重复记录
    } else {
        await updateRecord(selectedNote.id, weeklyRecurrence); // 更新现有的重复记录
    }
    joplin.views.dialogs.showMessageBox("已设置为: 工作日每天重复")

    // 获取当前笔记的 body
    const note = await joplin.data.get(['notes', selectedNote.id], { fields: ['id', 'title', 'body'] });
    // 获取当前时间的时间戳
    const options = { hour12: false, timeZone: 'Asia/Shanghai' };
    var timestamp = new Date().toLocaleString('sv-SE', options); // 可以根据需要调整日期格式
    var body = "> " + timestamp + " Repeat Set As: Daily On Weekdays";
    body += "\n" + note.body;
    console.log("body:" + body)
    // 更新当前笔记的 body
    await joplin.data.put(['notes', selectedNote.id], null, { body: body });

    // 设置alarm 为当前时间 + 2 hours
    // await setTaskDueDate(selectedNote.id, new Date())
    await setTaskDueDate(selectedNote.id, new Date(Date.now() + 2 * 3600 * 1000))
    // 输出日志，确认添加了每周重复
    openRecurrenceDialog()
    console.log("Weekday repeat added to node: ", selectedNote.id);
    console.log("Weekday repeat added to node: ", selectedNote.title);
}
export async function setOverdueTodosToToday(){
    var startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    for (var note of await getAllNotes()){
        var recurrence = await getRecord(note.id)
        var dueDate = new Date(note.todo_due)
        if ((note.todo_due != 0) && (recurrence != null) && (recurrence.enabled) && (dueDate < startOfToday)){
            var newDueDate = startOfToday
            newDueDate.setHours(dueDate.getHours(), dueDate.getMinutes(), dueDate.getSeconds(), dueDate.getMilliseconds())
            await setTaskDueDate(note.id, newDueDate)
            await sleep(1000)
        }
    }
    joplin.views.dialogs.showMessageBox("Overdue Tasks Rescheduled")
}

export async function updateOverdueTodos(){
    var startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    for (var note of await getAllNotes()){
        var recurrence = await getRecord(note.id)
        if ((note.todo_due != 0) && (recurrence != null) && (recurrence.enabled) && (new Date(note.todo_due) < startOfToday)){
            await markTaskComplete(note.id)
            await processTodo(note, startOfToday)
            await sleep(1000)    
        }
    }
    joplin.views.dialogs.showMessageBox("Overdue Tasks Rescheduled")
}

/** processTodo *************************************************************************************************************************************
 * If the given todo has been completed and has a due date and recurrence is enable, the todo due date will be updated to the next due date and the *
 * task flagged as incomplete. The recurrence stop criteria is also processed, deactivating recurrence if the stop date is passed or the stop number*
 * falls below 1.                                                                                                                                   *
 ***************************************************************************************************************************************************/
async function processTodo(todo, after=null){
    var recurrence = await getRecord(todo.id)
    if ((todo.todo_completed != 0) && (todo.todo_due != 0) && (recurrence.enabled)){
        var initialDate = new Date(todo.todo_due)
        var nextDate = after == null ? recurrence.getNextDate(initialDate) : recurrence.getNextDateAfter(initialDate, after)
        await setTaskDueDate(todo.id, nextDate)
        await markTaskIncomplete(todo.id)
        await markSubTasksIncomplete(todo.id)
        recurrence.updateStopStatus()
        updateRecord(todo.id, recurrence)
    }
}
