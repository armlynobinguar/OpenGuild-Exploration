//! # Note Taking App
//! This is a simple note taking app smart contract that allows users to add and retrieve notes.

#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod note_app {
    use ink::prelude::string::String;
    use ink::storage::Mapping;

    /// Defines the storage of your contract for notes.
    #[derive(Default, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Note {
        pub id: u64,
        pub content: String,
        pub completed: bool,
    }

    #[ink(storage)]
    #[derive(Default)]
    pub struct NoteApp {
        notes: Mapping<(AccountId, u64), Note>,
        counter: Mapping<AccountId, u64>,
    }

    impl NoteApp {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                notes: Mapping::default(),
                counter: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn add_note(&mut self, content: String) {
            let caller = self.env().caller();
            let id = self.counter.get(caller).unwrap_or_default();

            let note = Note {
                id,
                content,
                completed: false,
            };
            self.notes.insert((caller, id), &note);

            let next_id = id.checked_add(1).unwrap();
            self.counter.insert(caller, &next_id);
        }

        #[ink(message)]
        pub fn toggle_note(&mut self, id: u64) -> bool {
            let caller = self.env().caller();
            let note = self.notes.get((caller, id)).unwrap();
            let mut note = note.clone();
            note.completed = !note.completed;
            self.notes.insert((caller, id), &note);
            note.completed
        }

        #[ink(message)]
        pub fn get_note(&self, id: u64) -> Option<Note> {
            let caller = self.env().caller();
            Some(self.notes.get((caller, id)).unwrap())
        }

        #[ink(message)]
        pub fn get_counter(&self, account_id: AccountId) -> u64 {
            self.counter.get(account_id).unwrap_or_default()
        }
    }

    /// Unit tests for the Note App contract.
    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn init_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let note_app = NoteApp::default();
            assert_eq!(note_app.get_counter(accounts.alice), 0);
        }

        #[ink::test]
        fn add_note_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let mut note_app = NoteApp::default();

            note_app.add_note("Meeting notes for project X".to_string());

            assert_eq!(note_app.get_counter(accounts.alice), 1);

            let note = note_app.notes.get(&(accounts.alice, 0)).unwrap();

            assert_eq!(note.id, 0);
            assert_eq!(note.content, "Meeting notes for project X".to_string());
            assert_eq!(note.completed, false);
        }

        #[ink::test]
        fn toggle_note_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let mut note_app = NoteApp::default();

            note_app.add_note("Meeting notes for project X".to_string());

            let note = note_app.notes.get(&(accounts.alice, 0)).unwrap();

            assert_eq!(note.completed, false);

            note_app.toggle_note(0);

            let note = note_app.notes.get(&(accounts.alice, 0)).unwrap();

            assert_eq!(note.completed, true);
        }

        #[ink::test]
        fn get_note_works() {
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();

            let contract = ink::env::account_id::<ink::env::DefaultEnvironment>();
            ink::env::test::set_callee::<ink::env::DefaultEnvironment>(contract);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);

            let mut note_app = NoteApp::default();

            note_app.add_note("Meeting notes for project X".to_string());

            let note = note_app.get_note(0).unwrap();

            assert_eq!(note.id, 0);
            assert_eq!(note.content, "Meeting notes for project X".to_string());
            assert_eq!(note.completed, false);
        }
    }
}
