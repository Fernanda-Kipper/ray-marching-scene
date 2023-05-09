export default class Button {
    constructor(id, secondText){
        this.element = document.getElementById(id);
    }

    addClickListener(callback, cancelCallback){
        this.element.addEventListener('click', callback);
    }

    setText(text){
        this.element.innerHTML = text;
    }

    enable(){
        this.element.removeAttribute('disabled');
    }

    disable(){
        this.element.setAttribute('disabled', 'true');
    }
}