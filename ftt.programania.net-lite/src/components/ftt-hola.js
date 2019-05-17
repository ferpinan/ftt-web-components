import {html, LitElement} from 'lit-element';


export default {
    name: 'ftt-hola',
    element: class extends LitElement {

        static get properties() {
            return {
                ocultar: {type: Boolean}
            };
        }

        constructor() {
            super();
            this.ocultar = false;
        }

        connectedCallback() {
            super.connectedCallback();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
        }

        ocultame(){
            console.log(this.ocultar);
            this.ocultar = !this.ocultar;
        }

        renderShit(){
            return html`
                <pre>${this.getAttribute("name")}</pre>
                <p>Hola ${this.getAttribute("name2")} Cocotero Chuchu! </p>
                <slot name="first"></slot>
                <p>Medio</p>
                <slot name="second"></slot>
            `;
        }

        render() {
            return html`
                <button @click=${this.ocultame}>Ocultar</button>
                ${this.ocultar ? "" : this.renderShit()}
                
            `;
        }
    }
};