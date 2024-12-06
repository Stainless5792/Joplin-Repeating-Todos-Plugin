/** Imports ****************************************************************************************************************************************/
import joplin from "api";
import { openSearchDialog } from "../gui/searchdialog/searchdialog";

/** openSearchNoteByTitleDialog ****************************************************************************************************************************
 * Opens the searchNoteByTitle dialog *
 ***************************************************************************************************************************************************/
export async function openSearchNoteByTitleDialog() {
  openSearchDialog();
}

// 根据正则表达式搜索note
export async function searchNoteByTitle(searchText: string) {
  // DONE 增加正则表达式支持, joplin 自带的搜索功能不支持正则表达式， 造成搜索结果不准确
  var allNotes = [];
  var pageNum = 0;
  do {
    var response = await joplin.data.get(["notes"], {
      fields: ["title", "id", "is_todo", "todo_completed"],
      page: pageNum++,
    });
    allNotes = allNotes.concat(response.items);
  } while (response.has_more);

  // 定义正则表达式
  const regex = new RegExp(searchText);

  console.log(`regex: ` + regex);
  // 使用 filter 方法进行正则表达式匹配
  const filteredResult = allNotes.filter((item) => regex.test(item.title));
  console.log(`filteredResult: ` + JSON.stringify(filteredResult));

  return filteredResult;

  // https://joplinapp.org/help/api/references/rest_api#filtering-data
  // https://joplinapp.org/help/apps/search

  // const query = titlesOnly ? `title:${searchText}` : searchText
  // const basic_query = `title:/${searchText}`
  // const basic_query = `title:/"${searchText}"`
  // const FTS_query = `title:${searchText}`
  // const query = basic_query
  // const fields = ['title', 'id', 'is_todo', 'todo_completed']

  // while (true) {
  //     const res = await joplin.data.get(['notes'], {
  //       // query,
  //       page,
  //       fields,
  //       limit: 100,
  //     })
  //     console.log(`Page ${page} has ${res.items.length} items.`)

  //     const { items: notes, has_more } = res
  //     allNotes = allNotes.concat(notes)

  //     hasMore = has_more
  //     if (!hasMore) {
  //       break
  //     } else {
  //       page++
  //     }
  //   }
  // return allNotes

}
