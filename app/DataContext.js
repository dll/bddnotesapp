var Notes = Notes || {};

Notes.dataContext = (function () {

    var notesList = [];
    var notesListStorageKey = "Notes.NotesList";

    function init() {
        loadNotesFromLocalStorage();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createBlankNote() {

        var dateCreated = new Date();
        var id = new String(dateCreated.getTime()) + new String(getRandomInt(0, 100));
        var noteModel = new Notes.NoteModel({
            id: id,
            dateCreated: dateCreated,
            title: "",
            narrative: ""
        });

        return noteModel;
    }

    function loadNotesFromLocalStorage() {

        var storedNotes = $.jStorage.get(notesListStorageKey);

        if (storedNotes !== null) {
            notesList = storedNotes;
        }

    }

    function getNotesList() {
        return notesList;
    }

    return {
        init: init,
        createBlankNote: createBlankNote,
        getNotesList: getNotesList
    };

})();