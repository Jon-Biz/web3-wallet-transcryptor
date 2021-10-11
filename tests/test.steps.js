// logging-in.steps.js

const { loadFeature, defineFeature } = require('jest-cucumber');

const feature = loadFeature('./tests/test.feature');

// import Data from '../index'

// const orbit = { get: jest.fn() }

// class mockedData extends Data {
//     getOrbit() { return orbit }
// }

defineFeature(feature, (test) => {        
    test('User logs in', ({ given, when, then }) => {
      expect(1).toBe(1)
        let app, store, storeSpy
        const userAddress = 'userAddress'
        given('the app', () => {
            app = new mockedData()
            store = app.getStore()
            storeSpy = jest.fn()
            store.subscribe(() => storeSpy(store.getState()))
        });

        when('a user logs in', () => {
            app.login(userAddress)
        });

        then('the app should request his root data from orbitdb', () => {
            expect(orbit.get).toHaveBeenCalledWith(userAddress)
            expect(storeSpy).toHaveBeenCalled()
            expect(storeSpy.mock.calls[0][0].login.status).toBeTruthy()
        });
    });

    // test('app requests data', ({ given, when, then }) => {
    //     given('the orbit interface', () => {

    //     });

    //     when('the app requests a datum', () => {

    //     });

    //     then('the interface should retreive the datum', () => {
    //         expect('unwritten code').toBe('code')

    //     });

    //     then('the interface should retreive the datumEdge', () => {
    //         expect('unwritten code').toBe('code')

    //     });

    // });
})
