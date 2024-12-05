/******************************************************************************************************************************************
****************************************************************** click to search ******************************************************** 
******************************************************************************************************************************************/
let searchButton = document.getElementById('searchButton');
let searchResultFieldset = document.getElementById('searchResultFieldset');
// searchButton.addEventListener('click', search);

function search() {
    let searchInput = document.getElementById('searchText');
    let searchText = searchInput.value;
    let searchResult = document.getElementById('searchResult');
    let searchResultHTML = '';
    searchResult.value = 'Searcing...'
    searchResultFieldset.style.display='block';    // show interval fieldset
    // let notes = getAllNotes();
    // for (let i = 0; i < notes.length; i++) {
    //     let note = notes[i];
    //     if (note.title.toLowerCase().includes(searchText.toLowerCase())) {
    //         searchResultHTML += '<div class="searchResult"><a href="' + note.id + '">' + note.title + '</a></div>';
    //     }
    // }
    // searchResult.innerHTML = searchResultHTML;
}
