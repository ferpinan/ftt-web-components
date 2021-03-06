import {html, LitElement} from 'lit-element';
import g2018 from '../../data/2018/grupos.json';
import g2019 from '../../data/2019/grupos.json';
import a2018 from '../../data/2018/audio.js';
import a2019 from '../../data/2019/audio.js';

import {repeat} from '../../node_modules/lit-html/directives/repeat';
import css from '../mystyles.scss';
import {doTextQuery, groupContentQuery} from './api';
import mdFactory from 'markdown-it';
const md = mdFactory();

const grupos = {
    2018: g2018,
    2019: g2019
};

const audios = {
    2018: a2018,
    2019: a2019
};

export default {
    name: 'ftt-grupos',
    element: class extends LitElement {

        static get properties() {
            return {
                content: Array,
                grupos: Array,
                year: Number
            };
        }

        constructor() {
            super();
            this.content = [];
            this.grupos = [];

        }

        connectedCallback() {
            super.connectedCallback();

            this.year = this.location.params.year;
            const list = grupos[this.year];
            const chunckSize = 5;
            this.grupos = list.slice(0, chunckSize);
            for (let i = chunckSize; i < list.length; i = i + chunckSize) {
                setTimeout(() => {
                    this.grupos = this.grupos.concat(list.slice(i, i + chunckSize));

                    this.grupos.map(g => g.id)
                        .forEach(n => {
                            doTextQuery(
                                groupContentQuery(this.year, n),
                                content => {
                                    const aux = [...this.content];
                                    aux[n] = md.render(content);
                                    this.content = aux;
                                }
                            );
                        });

                }, 0);
            }

            this.audios = audios[this.year];


        }

        render() {
            return html`

      <style>
      ${css}
      </style>

      <ftt-section-title 
            title="Grupos de trabajo ${this.year}" 
            subtitle="Agrupados por experiencias comunes">
            </ftt-section-title>

        <section class="section" style="padding: 1rem 1.5rem">
          <div class="container">
            <a href="/${this.year}/experiencias">Todas las experiencias</a> | 
            <a href="/${this.year}/asistentes">Todos los asistentes</a> |
            <a href="/${this.year}/links">Todos los links</a>
          </div>      
        </section>
        
        ${this.grupos.length === 0 ? html`
        <section class="section">
          <div class="container">
          <div class="notification is-warning">
            Todavía no se han creado los grupos para ésta edición. 
            Puedes ver cómo quedó la <a href="/2018/grupos">edición anterior</a>.
          </div>
          </div>
          </section>
        ` : ''}
        
          ${repeat(this.grupos, grupo => grupo.id, grupo => html`
            <ftt-grupo-section id="grupo-${grupo.id}" .year="${this.year}" .grupo="${grupo}" .content="${this.content[grupo.id]}" .audio="https://github.com/Programania/ftt/blob/master/${this.year}/audio/${grupo.id}.mp3?raw=true"></ftt-grupo-section>
          `)}
		  `;
        }
    }
};