/** Imports ****************************************************************************************************************************************/
import joplin from 'api';
import { openDialog } from '../gui/dialog/dialog';
import { openSearchDialog } from '../gui/searchdialog/searchdialog';
import { createRecord, getAllRecords, getRecord, updateRecord, deleteRecord} from './database';
import { getAllNotes, getNote, markTaskIncomplete, setTaskDueDate,unsetTaskDueDate, markSubTasksIncomplete, markTaskComplete } from "./joplin";
import { Recurrence } from '../model/recurrence';
import { sleep } from './misc';
import { start } from 'repl';



/** openSearchNoteByTitleDialog ****************************************************************************************************************************
 * Opens the searchNoteByTitle dialog *
 ***************************************************************************************************************************************************/
export async function openSearchNoteByTitleDialog(){
    openSearchDialog()
}


// 根据正则表达式搜索note
export async function searchNoteByTitle(searchText: string) {
    let hasMore = false
    let allNotes = []
    let page = 1
    // const query = titlesOnly ? `title:${searchText}` : searchText
    const query = `title:${searchText}`
    const fields = ['id', 'title', 'is_todo', 'todo_completed', 'order', 'created_time']

    // https://joplinapp.org/help/api/references/rest_api#filtering-data
    // https://joplinapp.org/help/apps/search

    while (true) {
        const res = await joplin.data.get(['search'], {
          query,
          page,
          fields,
          limit: 100,
        })
        console.log(`Page ${page} has ${res.items.length} items.`)
    
        const { items: notes, has_more } = res
        allNotes = allNotes.concat(notes)
    
        hasMore = has_more
        if (!hasMore) {
          break
        } else {
          page++
        }
      }
    
    //   const allFoldersResult: SearchResponse<Folder> = await joplin.data.get(['folders'], {})
    
      return allNotes
    //   {
    //     notes: allNotes
    //     folders: allFoldersResult.items,
    //   }
}
