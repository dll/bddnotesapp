var Notes = Notes || {}
Notes.model = Notes.model || {}

Notes.app = (function () {

    var notesList = [];

    function getNotesList() {
        return notesList;
    }

    return {

        getNotesList: getNotesList

    }

})();