#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod chat_contract {
    use ink::prelude::string::String;
    use ink::storage::Mapping;
    use ink::storage::Vec;

    /// Custom error type for better feedback.
    #[derive(Debug)]
    pub enum ChatError {
        /// Error when the message is empty.
        EmptyMessage,
    }

    #[ink(storage)]
    pub struct ChatContract {
        messages: Vec<(AccountId, String)>,  // Storing multiple messages with authors
        count: u64,
    }

    impl ChatContract {
        /// Constructor that initializes the `ChatContract` struct with default values.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                messages: Vec::new(),
                count: 0,
            }
        }

        /// A function that returns the current state of all messages.
        #[ink(message)]
        pub fn get_messages(&self) -> Vec<(AccountId, String)> {
            self.messages.clone() // Return a copy of messages
        }

        /// A function that allows the caller to send a new greeting.
        #[ink(message)]
        pub fn send_greeting(&mut self, new_message: String) -> Result<(), ChatError> {
            if new_message.is_empty() {
                return Err(ChatError::EmptyMessage); // Return error if message is empty
            }
            
            let author = self.env().caller();
            self.messages.push((author, new_message)); // Store the new message
            self.count += 1; // Increment the count
            
            // Emit an event for message sent
            self.env().emit_event(MessageSent { author, message: new_message });

            Ok(())
        }

        /// Function to get the total greetings count.
        #[ink(message)]
        pub fn total_greetings(&self) -> u64 {
            self.count
        }
    }

    /// Event emitted when a message is sent.
    #[ink(event)]
    pub struct MessageSent {
        #[ink(topic)]
        author: AccountId,
        message: String,
    }
}
