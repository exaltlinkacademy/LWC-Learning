public with sharing class AccountSearchResults {
  @AuraEnabled(cacheable=true)
  public static list<Account> getAccounts(string searchText){
    try{
        
        if(string.isEmpty(searchText)){
            return [SELECT id,Name From Account];
        }
        else{
          searchText = '%'+searchText+'%';
            return [Select id, Name from Account where name LIKE :searchText];
        }
        
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static list<contact> getAccountContacts(string accountId){
    try{
     return [Select id, Name from contact where accountId=:accountId];
      }
      
  catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
  }
  }

}