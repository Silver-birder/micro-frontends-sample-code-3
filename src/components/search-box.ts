import {LitElement, html, customElement, css, property, eventOptions} from 'lit-element';
import {ProductItem} from './product-item'
import {HttpLink} from "apollo-link-http";

const http = new HttpLink({
    uri: `${process.env.TEAM_SEARCH_API_URL}`
});

console.log(http);

@customElement('search-box')
export class SearchBox extends LitElement {
    static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;
    @property({type: String})
    keyword = '';

    @property()
    productItemComponents: ProductItem[] = [];

    render() {
        return html`
　　  <input type="text" id="keyword" @change="${this._onChange}" value="${this.keyword}"><button @click="${this._onClick}">検索</button>
      ${this.productItemComponents}
    `;
    }

    @eventOptions({capture: true})
    private _onClick() {
        this.dispatchKeywordEvent(this.keyword);
        this.dispatchHistoryEvent(this.keyword);
    }

    dispatchKeywordEvent(keyword: string) {
        const search: SearchBoxEvent = {
            detail: {
                keyword: keyword,
                callback: (async (keyword: string) => {
                    const productItemComponent = new ProductItem();
                    productItemComponent.name = keyword;
                    this.productItemComponents = [];
                    this.productItemComponents.push(productItemComponent);
                    const map = new Map();
                    this.update(map)
                }).bind(this)
            }
        };
        let event: CustomEvent = new CustomEvent('search-box-button-click', search);
        this.dispatchEvent(event);
    }

    dispatchHistoryEvent(keyword: string) {
        const search: SearchBoxEvent = {
            detail: {
                keyword: keyword,
            }
        };
        let event: CustomEvent = new CustomEvent('search-box-keyword-history', search);
        this.dispatchEvent(event);
    }

    @eventOptions({capture: true})
    private _onChange(e: Event) {
        this.keyword = (<HTMLInputElement>e.target).value;
    }
}

export interface SearchBoxEvent extends CustomEventInit {
    detail: {
        keyword: String,
        callback?(keyword: String): void
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'search-box': SearchBox;
    }
}
