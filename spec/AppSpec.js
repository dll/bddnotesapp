
describe("Notes public interface exists", function () {

    it("Defines the app", function () {
        expect(Notes.app).toBeDefined();
    });

    it("Has public function: getNotesList", function () {
        expect(Notes.app.getNotesList).toBeDefined();
    });

});

describe("Notes functions", function () {

    it("Returns a list of notes", function () {

        var notesList = Notes.app.getNotesList();

        expect(notesList instanceof Array).toBeTruthy();
    });
});