#[cfg(test)]
mod tests {
    use super::*;

    #[ink::test]
    fn default_works() {
        let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

        // Set the contract as callee and Alice as caller.
        let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
        ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
        ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

        let chat_contract = ChatContract::new();
        assert_eq!(chat_contract.total_greetings(), 0);
    }

    #[ink::test]
    fn send_and_get_greeting() {
        let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
        
        // Set the contract as callee and Alice as caller.
        let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
        ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
        ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

        let mut chat_contract = ChatContract::new();

        // Alice sends a greeting
        chat_contract.send_greeting("Hi from Alice".to_string());
        assert_eq!(chat_contract.total_greetings(), 1);

        // Get Alice's greeting
        let (caller, message, count) = chat_contract.get_greeting().unwrap();
        assert_eq!(caller, accounts.alice);
        assert_eq!(message, "Hi from Alice".to_string());
        assert_eq!(count, 1);

        // Set Bob as the caller
        ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);

        // Bob sends a greeting
        chat_contract.send_greeting("Hello from Bob".to_string());
        assert_eq!(chat_contract.total_greetings(), 2);

        // Get Bob's greeting
        let (caller, message, count) = chat_contract.get_greeting().unwrap();
        assert_eq!(caller, accounts.bob);
        assert_eq!(message, "Hello from Bob".to_string());
        assert_eq!(count, 2); // The count should reflect the number of greetings
    }
}
