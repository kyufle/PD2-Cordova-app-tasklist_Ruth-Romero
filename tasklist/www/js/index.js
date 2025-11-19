/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

$(document).ready(function() {
    console.log('Tasklist application initialized.');
    let dialog; 

    const buttonOpenDialog = document.getElementById("afegir");
    const eliminate = document.getElementById("eliminar");
    const confirmarEliminar = document.getElementById("confirmarEliminar");

    let tasks = [];
    const render = () => {
        $(".lista").empty();
        tasks.forEach((task, index) => {
            const liElement = $(`<div class="${task.completed ? "completed" : ""}"></div>`); // Se corrige a </div>
            $(".lista").append(liElement);
            liElement.append(`<span>${task.name}</span>`);
            const buttonEditElement = $("<button class=\"editar\">Editar</button>");
            liElement.append(buttonEditElement);
            const inputEditarElement = $('<input class="inputEditar" type="text" />');
            liElement.append(inputEditarElement);
            const buttonOkElement = $('<button class=\"ok\">OK</button>');
            liElement.append(buttonOkElement);
            liElement.append('<input class="checkBorrar" type="checkbox" />');

            buttonEditElement.click(() => {
                inputEditarElement.val(task.name);
                liElement.addClass("editando");
            })

            buttonOkElement.click(()=>{
                liElement.removeClass("editando");
                task.name = inputEditarElement.val();
                saveLocalStorage();
                render();
            })
            liElement.children('span').click(() => { 
                task.completed = !task.completed;
                saveLocalStorage();
                render();
            });
        });
    }
    const createTask = (name) => {
        tasks.push({
            name: name,
            completed: false,
        });
        saveLocalStorage();
    }
    const saveLocalStorage = () => {
        localStorage.setItem("tareas", JSON.stringify(tasks));
    }
    const readLocalStorage = () => {
        if (!localStorage.getItem("tareas")) {
            return;
        }
        tasks = JSON.parse(localStorage.getItem("tareas"));
    }

    dialog = $("#taskform").dialog({
        autoOpen: false,
        height: 200,
        width: 350,
        modal: true,
        buttons: {
            "afegir": function () {
                const text = $('#tasktext').val();
                if (text.trim()) { 
                    createTask(text);
                    render();
                    $('#tasktext').val("");
                    dialog.dialog("close");
                }
            },
            "cancelar": function () {
                dialog.dialog("close");
            },

        }
    });
    
    if (buttonOpenDialog) {
        buttonOpenDialog.addEventListener("click", () => {
            dialog.dialog("open");
        });
    }
    
    if (confirmarEliminar) {
        confirmarEliminar.addEventListener("click", () => {
            let tasklistElements = document.querySelectorAll("div.lista div input.checkBorrar");
            let removeList = [];
            tasklistElements.forEach((element, index) => {
                if (element.checked) {
                    removeList.push(index);
                }
            })
            removeList.reverse();
            removeList.forEach((index) => {
                tasks.splice(index, 1);
            })
            saveLocalStorage();
            render();
        })
    }

    readLocalStorage();
    render();
});