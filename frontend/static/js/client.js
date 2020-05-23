let resultado_ast = {};
let resultado_copia = {};
let resultado_errores = {};

async function generarAST() {
    var editor = ace.edit("editor");
    entrada = editor.getValue();

    const t = {
        texto: entrada
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(t)
    };

    const data = await fetch('http://localhost:3000/ast', options);
    const json = await data.json();

    modalast();
    console.log(json);
    resultado = json;
}

async function reportarCopia() {
    const data = await fetch('http://localhost:3000/copia');
    const json = await data.json();
    resultado_copia = json;
    modalCopia();
    console.log(json);

}

async function reportarErrores() {
    const data = await fetch('http://localhost:3000/erroresL');
    const json = await data.json();
    console.log(json);

    const data2 = await fetch('http://localhost:3000/erroresS');
    const json2 = await data2.json();
    console.log(json2);


    let tbl2 = document.getElementById("tbl_errores");
    let filas_e = "";
    let con_errores = 0;
    for (let i = 0; i < json.length; i++) {
        con_errores++;
        filas_e += "<tr ><td>" + con_errores + "</td>" +"<td>" + json[i]["error"] + "</td>" + "<td>" + json[i]["tipo"] + "<td>" + json[i]["fila"] + "</td>" + "<td>" + json[i]["columna"]  + "</tr>";
    }
    for (let i = 0; i < json2.length; i++) {
        con_errores++;
        filas_e += "<tr ><td>" + con_errores + "</td>" +"<td>" + json2[i]["error"] + "</td>" + "<td>" + json2[i]["tipo"] + "<td>" + json2[i]["fila"] + "</td>" + "<td>" + json2[i]["columna"]  + "</tr>";    }
    tbl2.innerHTML = filas_e;

    modalErrores();
}



function treeview(arbol) {

    var jsonObj = {};
    var jsonViewer = new JSONViewer();

    document.querySelector("#json").appendChild(jsonViewer.getContainer());

    var setJSON = function () {
        try {
            if (arbol == 'ast') {
                jsonObj = resultado.reportes_ast.js1;
            } else if (arbol == 'copia') {
                jsonObj = resultado_copia;
            }
        } catch (err) {
            alert(err);
        }
    };
    setJSON();
    jsonViewer.showJSON(jsonObj);
}

function modalast() {


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

  function modalCopia(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Reporte de Copia Generado',
        showConfirmButton: false,
        timer: 1500
      })
  }

  function modalErrores(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Reporte de Errores Generado',
        showConfirmButton: false,
        timer: 1500
      })
  }