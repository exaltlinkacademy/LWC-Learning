import { LightningElement, track } from 'lwc';

export default class AccountSearchForm extends LightningElement {

    searchText = '';
    onChangeHandler(event){
    this.searchText = event.target.value;
    }

    onClickHandler(){

        const event = new CustomEvent('searchaccountcontact', {detail:this.searchText});
        this.dispatchEvent(event);
    }
}