import {html, LitElement} from 'lit-element';


export default {
    name: 'ftt-hola',
    element: class extends LitElement {

        static get properties() {
            return {};
        }

        constructor() {
            super();
        }

        connectedCallback() {
            super.connectedCallback();
        }

        disconnectedCallback() {
            super.disconnectedCallback();
        }


        render() {
            return html`
        <pre>${JSON.stringify(this.getAttribute("name"), null, 2)}</pre>
        <p>Hola ${this.getAttribute("name2")} Cocotero Chuchu! </p>
        ${this.textContent}
    `;
        }
    }
};