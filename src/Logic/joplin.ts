import joplin from "api";

export async function getAllNotes(){
    var allNotes = [];
    let pageNum = 0;
    let morePagesExist = false;
	do {
		let response = await joplin.data.get(['notes'], { fields: ['id', 'title', 'body', 'todo_completed'], page: pageNum++})
        allNotes = allNotes.concat(response.items)
        morePagesExist = response.has_more;
	} while (morePagesExist)
    return allNotes;
}

export async function getNote(noteID){
    var note = null
    try {
        note = await joplin.data.get(['notes', noteID], { fields: ['id', 'title', 'body', 'todo_completed']})
    } catch(error) {
        if (error.message != "Not Found") { throw(error) }
    }
    return note
}

export async function getSelectedNote(){
    return await joplin.workspace.selectedNote()
}