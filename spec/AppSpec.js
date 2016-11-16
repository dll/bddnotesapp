
describe("Data context tests", function () {
    "use strict";

    var notesListStorageKey = "Notes.NotesListTest";
    
    it("Exists in the app", function () {
        expect(Notes.dataContext).toBeDefined();
    });

    it("Returns notes Array", function () {
        Notes.dataContext.init(notesListStorageKey);
        var notesList = Notes.dataContext.getNotesList();
        expect(notesList instanceof Array).toBeTruthy();
    });

    it("Returns a blank note", function () {
        
        var blankNote = Notes.dataContext.createBlankNote();
        expect(blankNote.title.length === 0).toBeTruthy();
        expect(blankNote.narrative.length === 0).toBeTruthy();
    });

    it("Has init function", function () {
        expect(Notes.dataContext.init).toBeDefined();
    });

    it("Returns dummy notes saved in local storage", function () {

        Notes.testHelper.createDummyNotes();
        // Load dummy notes from local storage.
        Notes.dataContext.init(notesListStorageKey);

        var notesList = Notes.dataContext.getNotesList();

        expect(notesList.length > 0).toBeTruthy();
    });

    it("Saves a note to local storage", function () {

        // Make sure LS is empty before the test.
        $.jStorage.deleteKey(notesListStorageKey);
        var notesList = $.jStorage.get(notesListStorageKey);
        expect(notesList).toBeNull();


        // Create a note.
        var dateCreated = new Date();
        var id = dateCreated.getTime().toString();
        var noteModel = new Notes.NoteModel({ id: id, dateCreated: dateCreated, title: "" });
        Notes.dataContext.init(notesListStorageKey);
        Notes.dataContext.saveNote(noteModel);

        // Should retrieve the saved note.
        notesList = $.jStorage.get(notesListStorageKey);
        var expectedNote = notesList[0];

        //expect(expectedNote instanceof Notes.NoteModel).toBeTruthy();
        expect(expectedNote).toBeTruthy();

        // Clean up
        $.jStorage.deleteKey(notesListStorageKey);
    });

    it("Removes a note from local storage", function () {

        // Create a note.
        var dateCreated = new Date();
        var id = new String(dateCreated.getTime());
        var noteModel = new Notes.NoteModel({
            id: id,
            dateCreated: dateCreated,
            title: "",
            narrative: ""
        });

        // Start with an empty notes list.
        var notesList = [];
        // Add note to local storage.
        notesList.push(noteModel);
        $.jStorage.set(notesListStorageKey, notesList);
        notesList = $.jStorage.get(notesListStorageKey);
        expect(notesList.length).toEqual(1);

        // Proceed to delete.
        Notes.dataContext.init(notesListStorageKey);
        Notes.dataContext.deleteNote(noteModel);

        // Should retrieve empty array
        notesList = $.jStorage.get(notesListStorageKey);
        //expect(notesList.length).toEqual(0);

        // Clean up
        $.jStorage.deleteKey(notesListStorageKey);

    });

});