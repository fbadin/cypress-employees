/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    signUp(): Chainable<any>;
  }
}