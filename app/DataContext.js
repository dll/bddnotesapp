var Notes = Notes || {};//如果Notes有真值则可用返回Notes，否则赋为空对象，类似三目运算符：？

Notes.dataContext = (function ($) {
    "use strict";//严格模式
    var notesList = [], notesListStorageKey;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var createBlankNote = function () {
        var dateCreated = new Date();
        var id = dateCreated.getTime().toString() + (getRandomInt(0, 100)).toString();
        //note的数据模型
        var noteModel = new Notes.NoteModel({
            id: id,
            dateCreated: dateCreated,
            title: "",
            narrative: ""
        });
        return noteModel;
    };

    //从本地存储中加载数据
    var loadNotesFromLocalStorage = function () {
        var storedNotes = $.jStorage.get(notesListStorageKey);//使用jStorage插件
        if (storedNotes !== null) {
            notesList = storedNotes;
        }
    };

    var saveNotesToLocalStorage = function () {
        $.jStorage.set(notesListStorageKey, notesList);
    };

    var saveNote = function (noteModel) {
        var found = false;
        var i;
        for (i = 0; i < notesList.length; i += 1) {
            if (notesList[i].id === noteModel.id) {
                notesList[i] = noteModel;
                found = true;
                i = notesList.length;
            }
        }
        if (!found) {
        	//splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
            notesList.splice(0, 0, noteModel);
        }
        saveNotesToLocalStorage();
    };

    var deleteNote = function (noteModel) {
        var i;
        for (i = 0; i < notesList.length; i += 1) {
            if (notesList[i].id === noteModel.id) {
                notesList.splice(i, 1);
                i = notesList.length;
            }
        }
        saveNotesToLocalStorage();
    };

    var getNotesList = function () {
        return notesList;
    };
    //加载本地存储
    var init = function (storageKey) {
        notesListStorageKey = storageKey;
        loadNotesFromLocalStorage();
    };

    var pub = {//公共方法：完成5个函数的初始化
        init: init,
        createBlankNote: createBlankNote,
        getNotesList: getNotesList,
        saveNote: saveNote,
        deleteNote: deleteNote
    };
    return pub;

} (jQuery));
//(function($){...})(jQuery);
//匿名函数，形参使用$，是为了不与其他库冲突，实参用jQuery
//用于存放开发插件的代码,执行其中代码时DOM不一定存在.
//jQuery(function(){　});用于存放操作DOM对象的代码，执行其中代码时DOM对象已存在。
//不可用于存放开发插件的代码，因 为jQuery对象没有得到传递，外部通过jQuery.method也调用不了其中的方法（函数）。 
