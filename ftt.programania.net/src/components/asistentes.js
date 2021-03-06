import css from '../mystyles.scss';
import a2018 from '../../data/2018/asistentes.json';
import a2019 from '../../data/2019/asistentes.json';
import {html, LitElement} from 'lit-element';
import {repeat} from 'lit-html/directives/repeat';
import {capturar, dispatch, estaCapturado, liberar, limiteCapturas, subscribe} from './state';

const data = {
    2018: a2018,
    2019: a2019
};

export default {
    name: 'ftt-asistentes',
    element: class extends LitElement {

        static get properties() {
            return {
                capturados: {type: Array},
                year: {type: Number},
                asistentes: {type: Array},
            };
        }

        constructor() {
            super();
            this.unsubscribe = null;
            this.asistentes = [];
            this.todos = [];
            this.capturados = [];
        }

        connectedCallback() {
            super.connectedCallback();
            this.year = this.location.params.year;
            this.todos = data[this.year];

            const list = data[this.year];
            const chunckSize = 10;

            this.asistentes = list.slice(0, chunckSize);
            for (let i = chunckSize; i < list.length; i = i + chunckSize) {
                setTimeout(() => {
                    this.asistentes = this.asistentes.concat(list.slice(i, i + chunckSize));
                }, 0);
            }

            this.unsubscribe = subscribe(state => {
                this.capturados = state.capturados;
            });
        }

        filter(e) {
            this.asistentes = this.todos
                .filter(entry => entry.nombre.toLowerCase().includes(e.target.value.toLowerCase()));
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            this.unsubscribe();
        }

        shortVersion(title = '') {
            if (title.length < 30)
                return title.replace('"', '');
            return title.replace(/"/g, '').substring(0, 30) + '...';
        }

        render() {
            // language=HTML
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
          <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><a href="/${this.year}/grupos">${this.year}</a></li>
              <li class="is-active"><a href="#" aria-current="page">Asistentes</a></li>
            </ul>
          </nav>
        
        </div>
        </section>
        
        
        <ftt-collapse .title="Asistentes capturados (${this.capturados.length})">
            
              ${this.capturados.length >= 10 ? html`
              <div class="notification is-warning">
                
                Máximo <strong>diez</strong> capturas.
                <br/>
                <small>¿De verdad crees que eres capaz de desvirtualizar como dios manda a más de 10 personas?</small>
              </div>
              ` : ''}
              
              ${ this.capturados.length > 0 ? html`
              
              <table class="table is-striped is-fullwidth is-unselectable">
              <thead>
                <tr>
                <th>Capturado</th>
                <th></th>
              </tr>          
              </thead>
              <tbody>
                ${repeat(this.capturados, capturado => capturado.id, capturado => html` 
                  <tr>
                  <td>${capturado.nombre}</td>
                  <td><a class="delete" @click="${(e) => {
                e.stopPropagation();
                dispatch(liberar(capturado));
            }}"></a></td>
                  </tr>
                `)}
                </tbody>
              </table>
              
              ` : '' }
        </ftt-collapse>
         
           
          ${this.asistentes.length === 0 ? html`
          <section class="section">
            <div class="container">
            <div class="notification is-warning">
              Todavía no hay asistentes para ésta edición.
              Puedes ver a los <a href="/2018/asistentes">asistentes del año pasado</a>.
            </div>
            </div>
          </section>
        ` : ''}
          
          <section class="section is-paddingless">
          <div class="container">
          
            <nav class="level">
              <div class="level-left">
                <div class="level-item">
                  <p class="subtitle is-5">
                     Asistentes
                  </p>
                </div>
                </div>
                <div class="level-right">
                <div class="level-item">
                  <div class="field has-addons">
                    <p class="control">
                      <input @keyup="${e => {
                this.filter(e);
            }}" 
                          class="input" type="text" placeholder="Encuentra un asistente">
                    </p>
                    <p class="control">
                      <button class="button">
                        Buscar
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            
            </nav>
            </div>
            </section>
            
            
            <section class="section">
          <div class="container">
          

      <div class="columns is-multiline">          
        ${repeat(this.asistentes, asistente => html`
          <div class="column is-one-third">
            <div class="card">
              <div class="card-content">

                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img src="${asistente.foto}" alt="No disponible">
                    </figure>
                  </div>
                  <div>
                    <p style="font-size: 0.9em" class="title">${asistente.nombre}</p>
                    <p style="font-size: 0.8em" class="subtitle">
                    <a style="color:#757763" target="_blank" href="https://twitter.com/@${asistente.twitter}">
                        @${asistente.twitter}
                    </a>
                    </p>
                  </div>
                </div>
                <div class="content">
                  <a href="/${this.year}/experiencia/${asistente.id}">
                      ${this.shortVersion(asistente.experiencia.title)}
                  </a> 
                  <br/>
                  ${asistente.grupo ? html`Grupo: <a href="/${this.year}/grupo/${asistente.grupo.id}">${asistente.grupo.name}</a>` : ''}
                  
                </div>
                      <button ?disabled="${limiteCapturas() || estaCapturado(asistente)}" class="button is-small" 
                                 @click="${() => {
                dispatch(capturar(asistente));
            }}">Capturarlo</button>
                
              </div>
            </div>
        </div>
        `)}
      </div>
      
      </div>
      </section>
      
  
    `;
        }
    }
};