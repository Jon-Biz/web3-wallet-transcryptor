import { defineFeature, loadFeature } from 'jest-cucumber'

const feature = loadFeature('./tests/test.feature')

defineFeature(feature, test => {
    test('Entering a correct password', ({ given, when, then }) => {
        given('I have previously created a password', () => {
          passwordValidator.setPassword('1234');
        });
    
        when('I enter my password correctly', () => {
          accessGranted = passwordValidator.validatePassword('1234');
        });
    
        then('I should be granted access', () => {
          expect(accessGranted).toBe(true);
        });
      });
})

