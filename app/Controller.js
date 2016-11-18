Notes.controller = (function ($, dataContext, document) {
    "use strict";
    var notesListSelector = "#notes-list-content",
        noNotesCachedMsg = "<div>Your notes list is empty.</div>",
        notesListPageId = "notes-list-page",
        noteEditorPageId = "note-editor-page",
        noteTitleEditorSel = "[name=note-title-editor]",
        noteNarrativeEditorSel = "[name=note-narrative-editor]",
        saveNoteButtonSel = "#save-note-button",
        invalidNoteDlgSel = "#invalid-note-dialog",
        defaultDlgTrsn = { transition: "slideup" },
        deleteNoteButtonSel = "#delete-note-button",
        deleteNoteContentPlaceholderSel = "#delete-note-content-placeholder",
        confirmDeleteNoteDlgSel = "#confirm-delete-note-dialog",
        okToDeleteNoteButtonSel = "#ok-to-delete-note-button",
        currentNote = null;

    var resetCurrentNote = function () {
        currentNote = null;
    }
    //返回首页，并设定slide效果
    var returnToNotesListPage = function () {
        $.mobile.changePage("#" + notesListPageId,
            { transition: "slide", reverse: true });
    };

    //页面间传值
    var queryStringToObject = function (queryString) {
        var queryStringObj = {};
        var e;
        var a = /\+/g;  // Regex for replacing addition symbol with a space
        var r = /([^&;=]+)=?([^&;]*)/g;
        var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
        e = r.exec(queryString);
        while (e) {
            queryStringObj[d(e[1])] = d(e[2]);
            e = r.exec(queryString);
        }
        return queryStringObj;
    };

    var renderSelectedNote = function (data) {
    	//解析URL地址 P178
        var u = $.mobile.path.parseUrl(data.options.fromPage.context.URL);
        var re = "^#" + noteEditorPageId;

        if (u.hash.search(re) !== -1) {
            var queryStringObj = queryStringToObject(data.options.queryString);
            var titleEditor = $(noteTitleEditorSel);
            var narrativeEditor = $(noteNarrativeEditorSel);
            var noteId = queryStringObj["noteId"];
            if (typeof noteId !== "undefined") {
                // We were passed a note id => We're editing an existing note.
                var notesList = dataContext.getNotesList();
                var notesCount = notesList.length;
                var note;
                for (var i = 0; i < notesCount; i++) {
                    note = notesList[i];
                    if (noteId === note.id) {
                        currentNote = note;
                        titleEditor.val(currentNote.title);
                        narrativeEditor.val(currentNote.narrative);            
                    }
                }
            } else {
                // We're creating a note. Reset the fields.
                titleEditor.val("");
                narrativeEditor.val("");
            }
            titleEditor.focus();
        }
    };
    //页面切换
    var onPageChange = function (event, data) {
        var toPageId = data.toPage.attr("id");
        var fromPageId = null;
        if (data.options.fromPage) {
            fromPageId = data.options.fromPage.attr("id");
        }
        switch (toPageId) {
            case notesListPageId:
                resetCurrentNote(); // <-- Reset reference to the note being edited
                renderNotesList();
                break;
            case noteEditorPageId:
                if (fromPageId === notesListPageId) {
                    renderSelectedNote(data);
                }
                break;
        }
    };
    var onPageBeforeChange = function (event, data) {
        if (typeof data.toPage === "string") {
            var url = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(url)) {
                data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, "")).search.replace("?", "");
            }
        }
    };
    //动态生成DOM元素
    var renderNotesList = function () {
        var notesList = dataContext.getNotesList();
        var view = $(notesListSelector);
        view.empty();
        if (notesList.length === 0) {
            $(noNotesCachedMsg).appendTo(view);
        } else {
            var liArray = [],
                notesCount = notesList.length,
                note,
                dateGroup,
                noteDate,
                i;
            var ul = $("<ul id=\"notes-list\" data-role=\"listview\"></ul>").appendTo(view);
            for (i = 0; i < notesCount; i += 1) {
                note = notesList[i];
                noteDate = (new Date(note.dateCreated)).toDateString();
                if (dateGroup !== noteDate) {
                    liArray.push("<li data-role=\"list-divider\">" + noteDate + "</li>");
                    dateGroup = noteDate;
                }
                liArray.push("<li>"
                    + "<a data-url=\"index.html#note-editor-page?noteId=" + note.id + "\" href=\"index.html#note-editor-page?noteId=" + note.id + "\">"
                    + "<div  class=\"list-item-title\">" + note.title + "</div>"
                    + "<div class=\"list-item-narrative\">" + note.narrative + "</div>"
                    + "</a>"
                    + "</li>");
            }
            var listItems = liArray.join("");
            $(listItems).appendTo(ul);
            ul.listview();
        }
    };
    var onSaveNoteButtonTapped = function () {
        // Validate note.
        var titleEditor = $(noteTitleEditorSel);
        var narrativeEditor = $(noteNarrativeEditorSel);
        var tempNote = dataContext.createBlankNote();
        tempNote.title = titleEditor.val();
        tempNote.narrative = narrativeEditor.val();
        if (tempNote.isValid()) {
            if (null !== currentNote) {
                currentNote.title = tempNote.title;
                currentNote.narrative = tempNote.narrative;
            } else {
                currentNote = tempNote;
            }
            dataContext.saveNote(currentNote);
            returnToNotesListPage();
        } else {
            $.mobile.changePage(invalidNoteDlgSel, defaultDlgTrsn);
        }
    };

    var onDeleteNoteButtonTapped = function () {
        if (currentNote) {
            // JRender selected note in confirmation dlg.
            // Deletion will be handled elsewhere, after user confirms it's ok to delete.
            var noteContentPlaceholder = $(deleteNoteContentPlaceholderSel);
            noteContentPlaceholder.empty();
            $("<h3>" + currentNote.title + "</h3><p>" + currentNote.narrative + "</p>").appendTo(noteContentPlaceholder);
            $.mobile.changePage(confirmDeleteNoteDlgSel, defaultDlgTrsn);
        }
    };

    var onOKToDeleteNoteButtonTapped = function () {
        dataContext.deleteNote(currentNote);
        returnToNotesListPage();
    };
    var init = function () {
        dataContext.init("Notes.NotesList");
        var d = $(document);
        d.bind("pagebeforechange", onPageBeforeChange);
        //jquery：bind() 方法为被选元素添加一个或多个事件处理程序，并规定事件发生时运行的函数。
        //javascript1.8.5版本中原生实现bind()
        //bind的作用和apply，call类似都是改变函数的execute context，也就是runtime时this关键字的指向。
        //但是使用方法略有不同。apply 、 call 、bind 三者都是用来改变函数的this对象的指向的；
        //三者第一个参数都是this要指向的对象，也就是想指定的上下文；
        //三者都可以利用后续参数传参；
        //bind 是返回对应函数，便于稍后调用；apply 、call 则是立即调用 。
        d.bind("pagechange", onPageChange);
        d.delegate(saveNoteButtonSel, "tap", onSaveNoteButtonTapped);
        d.delegate(deleteNoteButtonSel, "tap", onDeleteNoteButtonTapped);
        d.delegate(okToDeleteNoteButtonSel, "tap", onOKToDeleteNoteButtonTapped);
    };
    var pub = {
        init: init
    };
    return pub;

} (jQuery, Notes.dataContext, document));//实参

$(document).bind("mobileinit", function () {
    Notes.controller.init();
});