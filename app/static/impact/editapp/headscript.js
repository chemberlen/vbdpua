

var oDoc, sDefTxt;

function initDoc(el_clicked, deftext) {
    oDoc = el_clicked; //document.getElementById("textBox");
    sDefTxt = deftext;
    oDoc.contentEditable = true;
    oDoc.id = "edtBlck";

    oDoc.focus();
    // setDocMode(true)
};

function formatDoc(sCmd, sValue) {
    document.execCommand(sCmd, false, sValue);
    oDoc.focus();
};


function validateMode() {
    if (!document.compForm.switchMode.checked) { return true; }
    alert("Uncheck \"Show HTML\".");
    oDoc.focus();
    return false;
};

function printDoc() {
    if (!validateMode()) { return; }
    var oPrntWin = window.open("", "_blank", "width=50ё0,height=500,left=300,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
    oPrntWin.document.open();
    oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
    oPrntWin.document.close();
};

function removeEdtbl() {
    $("#edtBlck").removeAttr("contentEditable");
    $("#edtBlck").removeAttr("id");

};

function chngtag() {
    var tg = $('#tagsname').val()
    $.fn.changeTag = function(tg) {
        // create the new, empty shim
        var replacement = $('<' + tg + '>');
        // empty container to hold attributes
        var attributes = {};
        // copy all the attributes to the shell
        $.each(this.get(0).attributes, function(index, attribute) {
            attributes[attribute.name] = attribute.value;
        });
        // assign attributes to replacement
        replacement.attr(attributes);
        // copy the data
        replacement.html(this.html());
        // get all the kids, with data and events
        var contents = this.children().clone(true);
        // inseminate
        replacement.append(contents);
        // swap it out
        this.replaceWith(replacement);
    }
    $('#ready').changeTag(tg);
};
