import css from '../mystyles.scss';
import a2018 from '../../data/2018/asistentes.json';
import a2019 from '../../data/2019/asistentes.json';
import {html, LitElement} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';

const data = {
    2018: a2018,
    2019: a2019
};

export default {
    name: 'ftt-asistentes',
    element: class extends LitElement {

        static get properties() {
            return {
                year: {type: Number},
                asistentes: {type: Array},
                destacados: {type: Object}
            };
        }

        constructor() {
            super();
            this.asistentes = [];
            this.destacados = [];
        }

        connectedCallback() {
            super.connectedCallback();
            this.year = this.location.params.year; //location.params setted by vaadin router
            this.asistentes = data[this.year];
            this.destacados = [];
        }

        disconnectedCallback() {
            super.disconnectedCallback();
        }

        renderAsistentes() {
            return repeat(this.asistentes, asistente => asistente.id, element => {
                    return html`
                    <div class="card">
                        <div class="card-content">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image is-48x48">
                                        <img src="${element.foto}" alt="Placeholder image">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-4">${element.nombre}</p>
                                    <p class="subtitle is-6">@${element.twitter}</p>
                                </div>
                            </div>

                            <div class="content">
                                ${element.experiencia.title}
                            </div>
                            <button ?disabled="${this.isDestacado(element)}" @click=${(e) => this.destacar(e, element)} class="button">Destacar</button>
                            <button ?disabled="${!this.isDestacado(element)}" @click=${(e) => this.desdestacar(e, element)} class="button">Des-destacar</button>
                        </div>
                    </div>`
                }
            )
        }

        renderDestacados() {
            return repeat(this.destacados, destacado => destacado.id, element => {
                return html`<p>${element.nombre}</p>`;
            });
        }

        destacar(element, asistente) {
            this.destacados = [...this.destacados, asistente]
        }

        desdestacar(e, asistente) {
            // const destacadosCopy = [...this.destacados];
            // const index = destacadosCopy.findIndex(element => element.id === asistente.id );
            // destacadosCopy.splice(index, 1);
            // this.destacados = destacadosCopy;
            this.destacados = this.destacados.filter(destacado => destacado.id !== asistente.id);
        }

        isDestacado(asistente) {
            return this.destacados.some(destacado => destacado.id === asistente.id);
        }

        render() {
            const a = "aaaa!";
            return html`
        
        <style>
          ${css}
        </style>
        
        <ftt-section-title 
            title="Asistentes" 
            subtitle="${this.asistentes.length === 0 ? 'Todavía no hay asistentes para ésta edición' :
                `Ésta edición cuenta con ${data[this.year].length} deslumbrantes asistentes`}">
        </ftt-section-title>
        
        
        <section class="section">
            <div class="container">
                <div id="destacados"></div>
                <ftt-hola name=${this.asistentes} name2="Andoni">
                    <p>hehehehe</p>
                </ftt-hola>

                

                ${this.renderDestacados()}
                ${this.renderAsistentes()}
                    
                <pre>${JSON.stringify(this.asistentes, null, 2)}</pre>
            </div>
        </section>
    `;
        }
    }
};