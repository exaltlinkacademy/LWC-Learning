import { LightningElement,wire } from 'lwc';
// Import message service features required for subscribing and the message channel
import { subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import viewAccount from '@salesforce/messageChannel/viewAccount__c';
import getAccountContacts from '@salesforce/apex/AccountSearchResults.getAccountContacts';
import LightningConfirm from 'lightning/confirm';


import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";


export default class AccountContacts extends LightningElement {

    subscription=null;
    accountId = null;
    contacts=[];
    title='Contacts';
    isShowModalPopup = false;
    editableContactRecordId = '';


    @wire(MessageContext)messageContext;

    connectedCallback(){
        this.subscribeToMessageChannel();
    }

    get isAccountSelected(){
           if(this.accountId != null){
            return true;
           }
           else {
            return false;
           }
    }

    get hasContacts(){
        if(this.contacts.length > 0){
            return true;
           }
           else {
            return false;
           }
    }
    async getContacts() {
        const data = await getAccountContacts({ accountId: this.accountId });
        this.contacts = data;
    }
    
    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                viewAccount,
                (data) => this.handleAccountSelection(data),
                { scope: APPLICATION_SCOPE }
            );
        }
    }


    handleAccountSelection(data) {
        this.accountId = data.accountId;
        this.title = `${data.accountName}'s Contacts`;
        this.getContacts();
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
   
    disconnectedCallback(){
        this.unsubscribeToMessageChannel();  
    }

    edithandler(event){
        this.isShowModalPopup = true;
        this.editableContactRecordId = event.target.dataset.contactId;
    }

    addhandler(){
        this.isShowModalPopup = true;
    }


    async deletehandler(event){

        let contactId = event.target.dataset.contactId;

        const result = await LightningConfirm.open({
            message: 'Are you really want to delete this contact',
            variant: 'headerless',
            label: 'this is the aria-label value',
            // setting theme would have no effect
        });

        if(result){
           await deleteRecord(contactId);
           this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Record Saved successfully",
              variant: "success",
            }),
          )
        this.getContacts();
    }
}
    
    closepopuphandler(){
        this.isShowModalPopup = false;
        this.editableContactRecordId = '';
    }

    successhandler(){
        this.closepopuphandler();
        this.dispatchEvent(
            new ShowToastEvent({
              title: "Success",
              message: "Record Saved successfully",
              variant: "success",
            }),
          )
        this.getContacts();
    }

}

