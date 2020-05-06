function modal(){
 
 
    let timerInterval
    Swal.fire({
      title: 'Analizando Archivo :)',
      html: 'Listo en <b></b> .',
      timer: 1000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer')
      }
    })
}


function printt(){
    var editor = ace.edit("editor");
    var code = editor.getValue();
    console.log(code);
}


var editor;

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.innerText = contents;
  initAceEditor()
}

document.getElementById('file-input')
  .addEventListener('change', readSingleFile, false);


function initAceEditor() {
var editor = ace.edit("editor");
editor.setFontSize("15px") ;
editor.setValue($("#file-content").text());

}
