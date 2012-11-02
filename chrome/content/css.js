// Most of the code here is taken from http://keyconfig.petricek.net/

var css = {

 /**
  * Returns true if focus is on an element which takes some sort of input. in
  * that case, we do not want to catch key presses.
  */
 inputFocus: function() {
    var focusedEl = document.commandDispatcher.focusedElement;

    // check if focused element takes input
    if (focusedEl) {
      var focusedElLn = focusedEl.localName.toLowerCase();
      if (focusedElLn === "input"
      ||  focusedElLn === "textarea"
      ||  focusedElLn === "select"
      ||  focusedElLn === "button"
      ||  focusedElLn === "isindex") {
        return true;
      } else if (focusedElLn === "div") { // XXX edge-case for the wall input field at facebook
        if (focusedEl.attributes.getNamedItem("contenteditable").nodeValue === "true") {
          return true;
        }
      }
    }

    // check if focused element has designMode="on"
    var focusedWin = document.commandDispatcher.focusedWindow;
    if (focusedWin) {
      if (focusedWin.document.designMode === "on") {
        return true;
      }
    }

    // if we got this far, we should be able to catch key presses without
    // messing up something else; return false
    return false;
  },

  /** Handles KeyboardEvents. */
  onKeyPress: function(evt) {

    // hackishly handle C-S-a and C-S-e
    if (css.inputFocus()) {
      var invokeCommand = function(commandId) {
        var controller = document.commandDispatcher.getControllerForCommand(commandId);
        if (controller && controller.isCommandEnabled(commandId)) {
          controller.doCommand(commandId);
        }
        evt.preventDefault();
        evt.stopPropagation();
      }

      if (evt.which == 65 && evt.ctrlKey && evt.shiftKey) { // "a"
        invokeCommand("cmd_selectBeginLine");
      } else if (evt.which == 69 && evt.ctrlKey && evt.shiftKey) { // "e"
        invokeCommand("cmd_selectEndLine");
      }
    }
  },

  startup: function() {
    window.addEventListener("keypress", this.onKeyPress, false);
  }
};

window.addEventListener("load", function(e) { css.startup(); }, false);
