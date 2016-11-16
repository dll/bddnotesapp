
describe("Data context tests", function () {

    it("Exists in the app", function () {
        expect(Notes.dataContext).toBeDefined();
    });

    it("Returns notes Array", function () {

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
        Notes.dataContext.init();

        var notesList = Notes.dataContext.getNotesList();

        expect(notesList.length > 0).toBeTruthy();
    });      

});