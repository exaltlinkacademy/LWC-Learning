import { LightningElement } from 'lwc';

export default class AccountSearch extends LightningElement {
  searchText='';
  
  searchAccountContactHandler(event){
    this.searchText = event.detail;

  }  

  

}