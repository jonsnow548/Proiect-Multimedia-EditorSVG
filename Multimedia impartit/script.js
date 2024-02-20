var drawing = false;
var istoricForme = [];
var elementeSelectate = []; 
var editor = document.getElementById("editor");
var selectieDreptunghi = document.getElementById("selectieDreptunghi");
var selectieElipsa = document.getElementById("selectieElipsa");
var selectieRomb = document.getElementById("selectieRomb");
var selectieLinie = document.getElementById("selectieLinie");
var elemente = document.getElementById("elemente");
var figura = "";
var MOUSE_LEFT = 0;
var MOUSE_RIGHT = 2;
var KEY_DEL = 46;
var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
var elementNou = null;
var elementSelectat = null;
var currentColor = "#000000"; // Adăugat
var currentLineWidth = 1; // Adăugat
var currentShape = null;

// Eveniment de clic pentru instrumentul "Dreptunghi"
document.getElementById("dreptunghi").onclick = function() {
    figura = "dreptunghi";
}

// Eveniment de clic pentru instrumentul "Elipsa"
document.getElementById("elipsa").onclick = function() {
    figura = "elipsa";
}

// Eveniment de clic pentru instrumentul "Romb"
document.getElementById("romb").onclick = function() {
    figura = "romb";
}

// Eveniment de clic pentru instrumentul "Linie"
document.getElementById("linie").onclick = function() {
    figura = "linie";
}

// Eveniment pentru schimbarea culorii liniei
document.getElementById("line-color").addEventListener('change', updateLineColor);

// Funcție pentru setarea coordonatelor unui dreptunghi SVG
function setareCoordonateDreptunghi(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, "x", Math.min(x1, x2));
    obiect.setAttributeNS(null, "y", Math.min(y1, y2));
    obiect.setAttributeNS(null, "width", Math.max(x1, x2) - Math.min(x1, x2));
    obiect.setAttributeNS(null, "height", Math.max(y1, y2) - Math.min(y1, y2));
}

// Funcție pentru setarea coordonatelor unei elipse SVG
function setareCoordonateElipsa(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, "cx", (x1 + x2) / 2);
    obiect.setAttributeNS(null, "cy", (y1 + y2) / 2);
    obiect.setAttributeNS(null, "rx", Math.abs(x1 - x2) / 2);
    obiect.setAttributeNS(null, "ry", Math.abs(y1 - y2) / 2);
}

// Funcție pentru setarea coordonatelor unui romb SVG
function setareCoordonateRomb(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, "points", `${(x1 + x2) / 2},${y1}
        ${x2},${(y1 + y2) / 2}
        ${(x1 + x2) / 2},${y2}
        ${x1},${(y1 + y2) / 2}`);
}

// Funcție pentru setarea coordonatelor unei linii SVG
function setareCoordonateLinie(obiect, x1, y1, x2, y2) {
    obiect.setAttributeNS(null, "x1", x1);
    obiect.setAttributeNS(null, "y1", y1);
    obiect.setAttributeNS(null, "x2", x2);
    obiect.setAttributeNS(null, "y2", y2);
    obiect.setAttributeNS(null, "stroke", currentColor);
    obiect.setAttributeNS(null, "stroke-width", currentLineWidth);
}


editor.onmousedown = function(e) {
    if (e.button === MOUSE_LEFT) {
        // Obține coordonatele clicului mouse-ului relative la editor
        x1 = e.pageX - this.getBoundingClientRect().left;
        y1 = e.pageY - this.getBoundingClientRect().top;

        // Găsește elementele de la punctul de clic
        var elementeSubPunct = document.elementsFromPoint(e.clientX, e.clientY);

        // Găsește primul element SVG dintre elementele găsite (rect, ellipse, polygon sau line)
        var elementSVG = elementeSubPunct.find(el => el.tagName === 'rect' || el.tagName === 'ellipse' || el.tagName === 'polygon' || el.tagName === 'line');

        if (elementSVG) {
            // Dacă este clicat un element SVG, elimină clasa "selectat" de la toți copiii și o adaugă la elementul clicat
            var elementeCopii = document.querySelectorAll("#elemente *");
            elementeCopii.forEach(el => el.classList.remove("selectat"));

            elementSVG.classList.add("selectat");
            elementSelectat = elementSVG;

            elementeSelectate.push(elementSVG);
        } else {
            // Dacă nu este clicat niciun element SVG, elimină clasa "selectat" de la toți copiii și gestionează crearea formelor în funcție de instrumentul curent (figura)
            var elementeCopii = document.querySelectorAll("#elemente *");
            elementeCopii.forEach(el => el.classList.remove("selectat"));
            elementSelectat = null;

            switch (figura) {
                case "dreptunghi":
                    // Gestionează crearea unui dreptunghi
                    setareCoordonateDreptunghi(selectieDreptunghi, x1, y1, x2, y2);
                    selectieDreptunghi.style.display = "block";
                    break;
                case "elipsa":
                    // Gestionează crearea unei elipse
                    setareCoordonateElipsa(selectieElipsa, x1, y1, x2, y2);
                    selectieElipsa.style.display = "block";
                    break;
                case "romb":
                    // Gestionează crearea unui romb
                    setareCoordonateRomb(selectieRomb, x1, y1, x2, y2);
                    selectieRomb.style.display = "block";
                    break;
                case "linie":
                    // Gestionează crearea unei linii
                    setareCoordonateLinie(selectieLinie, x1, y1, x1, y1);
                    selectieLinie.style.display = "block";

                    // Creează un element de tip linie și îl adaugă la containerul SVG
                    currentShape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    currentShape.setAttribute('stroke', currentColor);
                    currentShape.setAttribute('stroke-width', currentLineWidth);
                    currentShape.setAttribute('x1', x1);
                    currentShape.setAttribute('y1', y1);
                    currentShape.setAttribute('x2', x1);
                    currentShape.setAttribute('y2', y1);

                    elemente.appendChild(currentShape);
                    drawing = true;

                    // Adaugă noul element de linie la istoricul formelor
                    istoricForme.push(currentShape);

                    break;
                default:
                    break;
            }
        }
    }
};


editor.onmouseup = function(e) {
    if (e.button === MOUSE_LEFT) {
        // Verifică dacă butonul stâng al mouse-ului a fost eliberat

        switch (figura) {
            case "dreptunghi":
                // Pentru instrumentul "dreptunghi", ascunde selecția și creează un element SVG de tip "rect"
                selectieDreptunghi.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                setareCoordonateDreptunghi(elementNou, x1, y1, x2, y2);
                break;
            case "elipsa":
                // Pentru instrumentul "elipsa", ascunde selecția și creează un element SVG de tip "ellipse"
                selectieElipsa.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                setareCoordonateElipsa(elementNou, x1, y1, x2, y2);
                break;
            case "romb":
                // Pentru instrumentul "romb", ascunde selecția și creează un element SVG de tip "polygon"
                selectieRomb.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                setareCoordonateRomb(elementNou, x1, y1, x2, y2);
                break;
            case "linie":
                // Pentru instrumentul "linie", ascunde selecția, creează un element SVG de tip "line" și îl adaugă la containerul SVG
                selectieLinie.style.display = "none";
                currentShape = document.createElementNS("http://www.w3.org/2000/svg", "line");
                setareCoordonateLinie(currentShape, x1, y1, x2, y2);
                elemente.appendChild(currentShape);
                drawing = false;

                // Adaugă un eveniment de apăsare pe butonul drept pentru elementul de linie creat
                currentShape.onmousedown = function(e) {
                    if (e.button === MOUSE_RIGHT) {
                        // Dacă butonul drept al mouse-ului este apăsat pe linie, aplică acțiuni specifice (selectare și setare culori)
                        var elementeCopii = document.querySelectorAll("#elemente *");
                        elementeCopii.forEach(el => el.classList.remove("selectat"));
                        e.target.classList.add("selectat");
                        elementSelectat = e.target;
                        elementeSelectate.push(e.target);

                        if (elementSelectat.tagName === 'line') {
                            const lineColor = elementSelectat.getAttribute('stroke') || currentColor;
                            document.getElementById('line-color').value = lineColor;
                        }

                        const backgroundColor = elementSelectat.getAttribute('fill') || '';
                        document.getElementById('background-color').value = backgroundColor;
                    }
                };

                // Adaugă elementul de linie în istoricul formelor
                istoricForme.push(currentShape);

                currentShape = null;
                break;
            default:
                break;
        }

        // Dacă există un element nou și instrumentul nu este "linie", adaugă elementul în containerul SVG și actualizează variabilele
        if (elementNou && figura !== "linie") {
            elemente.appendChild(elementNou);
            drawing = false;

            // Adaugă elementul nou în istoricul formelor
            istoricForme.push(elementNou);

            // Adaugă un eveniment de apăsare pe butonul drept pentru elementul creat
            elementNou.onmousedown = function(e) {
                if (e.button === MOUSE_RIGHT) {
                    // Dacă butonul drept al mouse-ului este apăsat pe element, aplică acțiuni specifice (selectare)
                    var elementeCopii = document.querySelectorAll("#elemente *");
                    elementeCopii.forEach(el => el.classList.remove("selectat"));
                    e.target.classList.add("selectat");
                    elementSelectat = e.target;
                    elementeSelectate.push(e.target);
                }
            };
        }
    }
};


editor.onmouseup = function(e) {
    if (e.button === MOUSE_LEFT) {
        // Verifică dacă butonul stâng al mouse-ului a fost eliberat

        switch (figura) {
            case "dreptunghi":
                // Pentru instrumentul "dreptunghi", ascunde selecția și creează un element SVG de tip "rect"
                selectieDreptunghi.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                setareCoordonateDreptunghi(elementNou, x1, y1, x2, y2);
                break;
            case "elipsa":
                // Pentru instrumentul "elipsa", ascunde selecția și creează un element SVG de tip "ellipse"
                selectieElipsa.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
                setareCoordonateElipsa(elementNou, x1, y1, x2, y2);
                break;
            case "romb":
                // Pentru instrumentul "romb", ascunde selecția și creează un element SVG de tip "polygon"
                selectieRomb.style.display = "none";
                elementNou = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                setareCoordonateRomb(elementNou, x1, y1, x2, y2);
                break;
            case "linie":
                // Pentru instrumentul "linie", ascunde selecția, creează un element SVG de tip "line" și îl adaugă la containerul SVG
                selectieLinie.style.display = "none";
                currentShape = document.createElementNS("http://www.w3.org/2000/svg", "line");
                setareCoordonateLinie(currentShape, x1, y1, x2, y2);
                elemente.appendChild(currentShape);
                drawing = false;

                // Adaugă un eveniment de apăsare pe butonul drept pentru elementul de linie creat
                currentShape.onmousedown = function(e) {
                    if (e.button === MOUSE_RIGHT) {
                        // Dacă butonul drept al mouse-ului este apăsat pe linie, aplică acțiuni specifice (selectare și setare culori)
                        var elementeCopii = document.querySelectorAll("#elemente *");
                        elementeCopii.forEach(el => el.classList.remove("selectat"));
                        e.target.classList.add("selectat");
                        elementSelectat = e.target;
                        elementeSelectate.push(e.target);

                        if (elementSelectat.tagName === 'line') {
                            const lineColor = elementSelectat.getAttribute('stroke') || currentColor;
                            document.getElementById('line-color').value = lineColor;
                        }

                        const backgroundColor = elementSelectat.getAttribute('fill') || '';
                        document.getElementById('background-color').value = backgroundColor;
                    }
                };

                // Adaugă elementul de linie în istoricul formelor
                istoricForme.push(currentShape);

                currentShape = null;
                break;
            default:
                break;
        }

        // Dacă există un element nou și instrumentul nu este "linie", adaugă elementul în containerul SVG și actualizează variabilele
        if (elementNou && figura !== "linie") {
            elemente.appendChild(elementNou);
            drawing = false;

            // Adaugă elementul nou în istoricul formelor
            istoricForme.push(elementNou);

            // Adaugă un eveniment de apăsare pe butonul drept pentru elementul creat
            elementNou.onmousedown = function(e) {
                if (e.button === MOUSE_RIGHT) {
                    // Dacă butonul drept al mouse-ului este apăsat pe element, aplică acțiuni specifice (selectare)
                    var elementeCopii = document.querySelectorAll("#elemente *");
                    elementeCopii.forEach(el => el.classList.remove("selectat"));
                    e.target.classList.add("selectat");
                    elementSelectat = e.target;
                    elementeSelectate.push(e.target);
                }
            };
        }
    }
};


// Funcție pentru anularea ultimei acțiuni
function undo() {
    if (istoricForme.length > 0) {
        var formaStearsa = istoricForme.pop();
        elementSelectat = null;
        drawing = false;

        if (elementeSelectate.length > 0) {
            // Dacă sunt forme multiple selectate, le șterge pe toate
            elementeSelectate.forEach(el => el.remove());
            elementeSelectate = [];
        } else if (formaStearsa !== currentShape) {
            // Dacă forma ștearsă nu este forma curentă de desen, o șterge
            formaStearsa.remove();
        }

        if (formaStearsa === currentShape) {
            currentShape = null;
        }
    }
}

// Obține elementele canvas și contextul 2D
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Funcție pentru exportul ca imagine rasterizată
function exportToRaster() {
    var svg = new XMLSerializer().serializeToString(document.getElementById('elemente'));

    var img = new Image();
    img.onload = function () {
        // La încărcarea imaginii, desenează-o pe canvas
        ctx.drawImage(img, 0, 0);

        // Obține datele rasterizate sub formă de URL și descarcă imaginea
        var dataURL = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'export.png';
        a.click();
    };

    // Creează un obiect Blob pentru SVG și obține un URL pentru încărcarea imaginii
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);

    // Încarcă imaginea cu SVG-ul serializat
    img.src = url;
}

// Adaugă eveniment de clic pe butonul de ștergere
document.getElementById("sterge")?.addEventListener('click', function() {
    if (elementSelectat) {
        // Dacă există un element selectat, îl șterge
        elementSelectat.remove();
        elementSelectat = null;
    }
});

// Adaugă eveniment de clic pe butonul de export la raster
document.getElementById('exportBtn').addEventListener('click', exportToRaster);

// Funcție pentru exportul ca fișier SVG
function exportToSvg() {
    var svg = new XMLSerializer().serializeToString(document.getElementById('elemente'));

    // Creează un obiect Blob pentru SVG și obține un URL pentru descărcare
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'export.svg';
    a.click();
}

// Adaugă eveniment de clic pe butonul de export la SVG
document.getElementById('exportSvgBtn').addEventListener('click', exportToSvg);
