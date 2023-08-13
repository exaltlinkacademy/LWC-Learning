import { LightningElement,api, wire} from 'lwc';
import getAccounts from '@salesforce/apex/AccountSearchResults.getAccounts';

import { publish, MessageContext } from 'lightning/messageService';
import viewAccount from '@salesforce/messageChannel/viewAccount__c';

const COLUMNS = [
    { label: 'ID', fieldName: 'Id' },
    { label: 'Name', fieldName: 'Name'},
    { label: 'Actions', type:'button', typeAttributes:{
        label: 'View Contacts',
        name: 'View Contacts',
        title:'View Contacts',
        value:'View_Contacts'
    } }
];
export default class AccountSearchResult extends LightningElement {

    @api searchText;
    columns = COLUMNS;
    @wire (getAccounts, {searchText:'$searchText'})accountsList;


    @wire (MessageContext)messageContext;

    // Respond to UI event by publishing message
    viewcontactHandler(event) {
      
            const payload = { accountId: event.detail.row.Id, accountName:event.detail.row.Name};

            publish(this.messageContext, viewAccount, payload);

       
    }
   
}